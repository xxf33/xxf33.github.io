import { getRandomInt } from '../shared'

interface Position {
  x: number
  y: number
}

export interface SliderProps {
  readonly id: number
  readonly target: Position
  x: number
  y: number
}

export interface ResumeOptions {
  w: number
  h: number
  idList: number[]
  steps?: number
}

export class SlidingPuzzleModel {
  w = 3
  h = 3
  sliderList: SliderProps[] = []
  blankPos: Position = { x: this.w - 1, y: this.h - 1 }
  steps = 0
  isSolved = false

  init(w: number, h: number) {
    const length = w * h - 1
    if (this.sliderList.length !== length) {
      this.sliderList = Array.from({ length }, (_, index) => {
        const id = index + 1
        const target = { x: index % w, y: Math.floor(index / w) }
        return { id, target, ...target }
      })
    } else {
      this.sliderList.forEach(slider => {
        slider.x = slider.target.x
        slider.y = slider.target.y
      })
    }
    this.w = w
    this.h = h
    this.steps = 0
    this.isSolved = false
    this.blankPos = { x: w - 1, y: h - 1 }
  }

  load(options: ResumeOptions) {
    const { w, h, idList, steps = 0 } = options
    this.init(w, h)
    idList.forEach((id, index) => {
      // 约定 0 表示空位
      if (id !== 0) {
        const slider = this.sliderList.find(s => s.id === id)!
        slider.x = index % w
        slider.y = Math.floor(index / w)
      } else {
        this.blankPos = { x: index % w, y: Math.floor(index / w) }
      }
    })
    this.steps = steps
  }

  shuffle(steps = this.w * this.h * 10) {
    const vectors = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ]
    const maximin = vectors.length - 1
    while (steps > 0) {
      const random = getRandomInt(0, maximin)
      const [dx, dy] = vectors[random]
      const pos = { x: this.blankPos.x + dx, y: this.blankPos.y + dy }
      if (pos.x >= 0 && pos.x < this.w && pos.y >= 0 && pos.y < this.h) {
        this._doSwap(pos)
        steps--
      }
    }
  }

  move(id: number, passCheckSolved?: boolean) {
    if (this.isSolved) {
      return
    }
    const slider = this.sliderList.find(s => s.id === id)
    if (!slider) {
      return
    }
    const isMoved = this._doMove(slider)
    if (isMoved && !passCheckSolved) {
      this.isSolved = this._checkForSolved()
    }
  }

  _checkForSolved() {
    return this.sliderList.every(
      ({ x, y, target }) => x === target.x && y === target.y
    )
  }

  _doMove(slider: SliderProps) {
    let offsetX = Math.abs(slider.x - this.blankPos.x)
    let offsetY = Math.abs(slider.y - this.blankPos.y)
    if (offsetX !== 0 && offsetY !== 0) {
      return false
    }
    if (offsetX === 0) {
      const delta = slider.y > this.blankPos.y ? 1 : -1
      while (offsetY > 0) {
        this._doSwap({ x: this.blankPos.x, y: this.blankPos.y + delta })
        offsetY--
        this.steps++
      }
    } else {
      const delta = slider.x > this.blankPos.x ? 1 : -1
      while (offsetX > 0) {
        this._doSwap({ x: this.blankPos.x + delta, y: this.blankPos.y })
        offsetX--
        this.steps++
      }
    }
    return true
  }

  _doSwap(pos: Position) {
    const slider = this.sliderList.find(
      ({ x, y }) => x === pos.x && y === pos.y
    )
    if (slider) {
      const { x, y } = this.blankPos
      this.blankPos = { x: slider.x, y: slider.y }
      slider.x = x
      slider.y = y
    }
  }
}
