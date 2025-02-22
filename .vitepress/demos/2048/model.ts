import { arrayShuffle, type MoveCommand } from '../shared'

export interface TileProps {
  id?: number
  x: number
  y: number
  level: number
}

export interface ModelOptions {
  boardWidth: number
  popupStart: number
  popupMoved: number
  score: number
  times: number
  tiles: TileProps[]
}

export class G2048Model {
  static id = 0
  gg = false
  options!: ModelOptions
  cells: Array<TileProps | null>[] = []
  prevState: { score: number; tiles: string } | null = null

  constructor() {
    this.init()
  }

  init(options?: Partial<ModelOptions>) {
    this.options = {
      boardWidth: 4,
      popupStart: 2,
      popupMoved: 1,
      score: 0,
      times: 0,
      tiles: [],
      ...options,
    }
    this.gg = false
    this.prevState = null
    this.updateCells()
    if (this.options.tiles.length === 0) {
      this.popup(this.options.popupStart)
    } else {
      this.options.tiles.forEach(t => (t.id = G2048Model.id++))
    }
  }
  move(cmd: MoveCommand) {
    if (this.gg) {
      return
    }
    const score = this.options.score
    const tiles = JSON.stringify(this.options.tiles)
    this.doMoveTiles(cmd)
    if (
      score === this.options.score &&
      tiles === JSON.stringify(this.options.tiles)
    ) {
      return
    }
    this.updateCells()
    this.popup(this.options.popupMoved)
    this.options.times++
    this.prevState = { score, tiles }
  }

  back() {
    if (!this.prevState) {
      return
    }
    this.options.score = this.prevState.score
    this.options.tiles = JSON.parse(this.prevState.tiles)
    this.options.times--
    this.prevState = null
    this.gg = false
    this.updateCells()
  }

  popup(count: number) {
    const emptyCells = this.getEmptyCells()
    if (emptyCells.length < count) {
      return
    }
    arrayShuffle(emptyCells)
      .slice(0, count)
      .forEach(index => {
        const t = {
          id: G2048Model.id++,
          x: index % this.options.boardWidth,
          y: Math.floor(index / this.options.boardWidth),
          level: Math.random() < 0.9 ? 1 : 2,
        }
        this.options.tiles.push(t)
        this.cells[t.y][t.x] = t
      })
    if (!this.canIMove()) {
      this.gg = true
    }
  }

  canIMove() {
    const length = this.options.boardWidth
    if (this.options.tiles.length < length * length) {
      return true
    }
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        const level = this.cells[i][j]?.level
        if (
          (i < length - 1 && level === this.cells[i + 1][j]?.level) ||
          (j < length - 1 && level === this.cells[i][j + 1]?.level)
        ) {
          return true
        }
      }
    }
    return false
  }

  canIBack() {
    return !!this.prevState
  }

  updateCells() {
    const length = this.options.boardWidth
    if (this.cells?.length === length && this.cells[0]?.length === length) {
      this.cells.forEach(row => row.fill(null))
    } else {
      this.cells = Array.from({ length }, () =>
        Array.from({ length }, () => null)
      )
    }
    this.options.tiles.forEach(t => (this.cells[t.y][t.x] = t))
  }

  getEmptyCells(): number[] {
    const result: number[] = []
    this.cells.flat().forEach((cell, index) => !cell && result.push(index))
    return result
  }

  doMoveTiles(cmd: MoveCommand) {
    const { isReverse, prop, getCellsOnLine } = this.getMoveConfig(cmd)
    const length = this.options.boardWidth
    for (let i = 0; i < length; i++) {
      let tiles = getCellsOnLine(i).filter(Boolean) as TileProps[]
      let offset: number
      if (isReverse) {
        tiles = this.getMergedTilesOnLine(tiles.reverse()).reverse()
        offset = 0
      } else {
        tiles = this.getMergedTilesOnLine(tiles)
        offset = length - tiles.length
      }
      tiles.forEach((t, index) => (t[prop] = index + offset))
    }
    this.options.tiles = this.options.tiles.filter(t => t.level > 0)
  }

  getMoveConfig(cmd: MoveCommand) {
    const isReverse = cmd === 'up' || cmd === 'left'
    let prop: 'x' | 'y'
    let getCellsOnLine: (index: number) => Array<TileProps | null>
    if (cmd === 'up' || cmd === 'down') {
      prop = 'y'
      getCellsOnLine = (x: number) => this.cells.map(row => row[x])
    } else {
      prop = 'x'
      getCellsOnLine = (y: number) => this.cells[y]
    }
    return { isReverse, prop, getCellsOnLine }
  }

  getMergedTilesOnLine(tiles: TileProps[]) {
    for (let i = tiles.length - 1; i > 0; i--) {
      const current = tiles[i]
      const prev = tiles[i - 1]
      if (current.level === prev.level) {
        prev.level++
        current.level = 0
        this.options.score += 1 << prev.level
        i--
      }
    }
    return tiles.filter(t => t.level > 0)
  }
}
