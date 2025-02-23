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
