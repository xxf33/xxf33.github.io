import { arrayShuffle } from '../shared'

export interface Position {
  x: number
  y: number
}

export interface BoardProps {
  w: number
  h: number
  m: number
}

export interface BlockProps {
  readonly uid: number
  open?: boolean
  mark?: boolean
  mine?: boolean
  boom?: boolean
  adjacentMines?: number
}

export interface StorageData {
  board: BoardProps
  blocks: Array<[number, number]>
  duration: number
}

export class MinesweeperModel {
  state!: 'ready' | 'playing' | 'won' | 'lost'
  timer!: { duration: number; start?: number }
  board: BoardProps = { w: 9, h: 9, m: 10 }
  blocks: BlockProps[] = []
  mineUidArr: number[] = []
  markUidSet: Set<number> = new Set()
  siblingsCache: Map<number, number[]> = new Map()
  // prettier-ignore
  static readonly siblingsVec = [
    [-1, -1],[0, -1],[1, -1],
    [-1,  0],        [1,  0],
    [-1,  1],[0,  1],[1,  1]
  ];

  constructor() {
    this.init()
  }

  init(board?: Partial<BoardProps>) {
    if (this.board.w !== board?.w || this.board.h !== board?.h) {
      this.siblingsCache.clear()
    }
    this.board = { ...this.board, ...board }
    this.blocks = Array.from(
      { length: this.board.w * this.board.h },
      (_, index) => ({ uid: index })
    )
    this.markUidSet.clear()
    this.mineUidArr.length = 0
    this.timer = { duration: 0 }
    this.state = 'ready'
  }

  load(data: StorageData) {
    const { duration, board, blocks } = data
    this.init(board)
    const openArr: number[] = []
    blocks.forEach(b => {
      const [uid, num] = b
      const [open, mine, mark] = [1, 2, 4].map(bit => !!(num & bit))
      open && openArr.push(uid)
      mine && this.mineUidArr.push(uid)
      mark && this.markUidSet.add(uid)
      this.blocks[uid] = { uid, open, mine, mark }
    })
    openArr.forEach(uid => {
      this.blocks[uid].adjacentMines = this.getAdjacentMines(uid)
    })
    this.timer = { duration, start: Date.now() }
    this.state = 'playing'
  }

  dump() {
    const blocks = this.blocks
      .filter(b => b.open || b.mine || b.mark)
      .map(b => {
        let mask = 0
        b.open && (mask += 1)
        b.mine && (mask += 2) /** 1 << 1*/
        b.mark && (mask += 4) /** 1 << 2*/
        return [b.uid, mask] as [number, number]
      })
    const data: StorageData = {
      blocks,
      board: this.board,
      duration: this.timer.start
        ? Date.now() - this.timer.start + this.timer.duration
        : this.timer.duration,
    }
    return JSON.stringify(data)
  }

  restart() {
    if (this.state === 'ready') {
      return
    }
    this.blocks.forEach(b => {
      b.open = false
      b.mark = false
      b.boom = false
    })
    this.markUidSet.clear()
    this.timer = { duration: 0, start: Date.now() }
    this.state = 'playing'
  }

  posToUid(pos: Position) {
    return pos.y * this.board.w + pos.x
  }

  uidToPos(uid: number) {
    return {
      x: uid % this.board.w,
      y: Math.floor(uid / this.board.w),
    }
  }

  open(block: BlockProps, allowOpenAdjacent = true) {
    if (this.state === 'won' || this.state === 'lost') {
      return
    }
    if (this.state === 'ready') {
      this.placeMines(block.uid)
      this.timer.start = Date.now()
      this.state = 'playing'
    }
    if (block.mark) {
      this.mark(block)
    } else if (block.open && allowOpenAdjacent) {
      this.openAdjacent(block)
    } else {
      this.doOpen(block.uid)
      this.checkForWin('open')
    }
  }

  mark(block: BlockProps, allowOpenAdjacent = false) {
    if (this.state === 'won' || this.state === 'lost') {
      return
    }
    if (this.state === 'ready') {
      this.placeMines(block.uid)
      this.timer.start = Date.now()
      this.state = 'playing'
    }
    if (block.open) {
      allowOpenAdjacent && this.openAdjacent(block)
      return
    }
    if (block.mark) {
      block.mark = false
      this.markUidSet.delete(block.uid)
    } else {
      block.mark = true
      this.markUidSet.add(block.uid)
    }
    this.checkForWin('mark')
  }

  openAdjacent(block: BlockProps) {
    if (this.state !== 'playing' || !block.open) {
      return
    }
    let markCount = 0
    const waitingOpenList: number[] = []
    this.getSiblings(block.uid).forEach(uid => {
      if (this.blocks[uid].mark) {
        markCount++
      } else if (!this.blocks[uid].open) {
        waitingOpenList.push(uid)
      }
    })
    if (markCount === this.getAdjacentMines(block.uid)) {
      waitingOpenList.forEach(uid => this.doOpen(uid))
    }
  }

  doOpen(uid: number) {
    const block = this.blocks[uid]
    block.open = true
    if (block.mine) {
      block.boom = true
      this.gameOver(false)
    } else {
      this.doOpenAdjacent(uid)
    }
  }

  doOpenAdjacent(uid: number) {
    if (this.getAdjacentMines(uid) === 0) {
      this.getSiblings(uid).forEach(siblingUid => {
        const block = this.blocks[siblingUid]
        if (!block.open && !block.mine) {
          block.open = true
          this.doOpenAdjacent(siblingUid)
        }
      })
    }
  }

  placeMines(excludedUid: number) {
    const { w, h, m } = this.board
    let length = w * h
    let candidates = [...Array(length).keys()]
    candidates[excludedUid] = -1
    length--
    this.getSiblings(excludedUid).forEach(uid => {
      if (length >= m) {
        candidates[uid] = -1
        length--
      }
    })
    candidates = candidates.filter(uid => uid !== -1)
    arrayShuffle(candidates)
      .slice(0, m)
      .forEach(uid => {
        this.blocks[uid].mine = true
        this.mineUidArr.push(uid)
      })
  }

  checkForWin(mode: 'open' | 'mark') {
    let isWin = false
    if (mode === 'open') {
      isWin = this.blocks.every(block => block.open === !block.mine)
    } else if (mode === 'mark') {
      isWin =
        this.mineUidArr.length === this.markUidSet.size &&
        this.mineUidArr.every(uid => this.markUidSet.has(uid))
    }
    if (isWin) {
      this.gameOver(true)
    }
  }

  gameOver(isWin: boolean) {
    if (isWin) {
      this.state = 'won'
      this.markUidSet.clear()
      this.blocks.forEach(block => {
        if (block.mine) {
          block.mark = true
          this.markUidSet.add(block.uid)
        } else {
          block.open = true
        }
      })
    } else {
      this.state = 'lost'
      this.mineUidArr.forEach(uid => (this.blocks[uid].open = true))
      this.markUidSet.forEach(uid => (this.blocks[uid].open = true))
    }
  }

  getAdjacentMines(uid: number) {
    const block = this.blocks[uid]
    if (block.adjacentMines === undefined) {
      const siblings = this.getSiblings(uid)
      block.adjacentMines = siblings.reduce(
        (acc, curr) => (this.blocks[curr].mine ? acc + 1 : acc),
        0
      )
    }
    return block.adjacentMines
  }

  getSiblings(uid: number) {
    const cached = this.siblingsCache.get(uid)
    if (cached) {
      return cached
    }
    const { w, h } = this.board
    const { x, y } = this.uidToPos(uid)
    const siblings = MinesweeperModel.siblingsVec
      .map(([dx, dy]) => ({ x: x + dx, y: y + dy }))
      .filter(({ x, y }) => x >= 0 && x < w && y >= 0 && y < h)
      .map(pos => this.posToUid(pos))

    this.siblingsCache.set(uid, siblings)
    return siblings
  }
}
