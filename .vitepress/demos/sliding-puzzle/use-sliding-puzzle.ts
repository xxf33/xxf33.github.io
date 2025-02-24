import { reactive, toRefs } from 'vue'
import { bindMethod } from '../shared'
import { SlidingPuzzleModel } from './model'

export function useSlidingPuzzleModel() {
  const m = reactive(new SlidingPuzzleModel())
  const { isSolved, steps, sliderList } = toRefs(m)
  return {
    isSolved,
    steps,
    sliderList,
    init: bindMethod(m.init, m),
    load: bindMethod(m.load, m),
    move: bindMethod(m.move, m),
    shuffle: bindMethod(m.shuffle, m),
  }
}
