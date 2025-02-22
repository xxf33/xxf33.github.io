import { reactive, toRefs, watch, type MaybeRef } from 'vue'
import { useStorage, useThrottleFn } from '@vueuse/core'
import {
  bindMethod,
  useMoveCommand,
  usePageExit,
  type MoveCommand,
} from '../shared'
import { G2048Model } from './model'

export interface UseG2048Options {
  saveWhenExit?: boolean
  bestScoreKey?: string
  prevStateKey?: string
  moveThrottle?: number
}

export function useG2048(
  element: MaybeRef<HTMLElement | null | undefined>,
  args: Partial<UseG2048Options> = {}
) {
  const {
    saveWhenExit = true,
    bestScoreKey = '2048-best-score',
    prevStateKey = '2048-prev-state',
    moveThrottle = 100 /**ms */,
  } = args

  const model = reactive(new G2048Model())
  const { gg, options } = toRefs(model)

  if (saveWhenExit) {
    usePageExit(() => {
      localStorage.setItem(prevStateKey, JSON.stringify(options.value))
    })
  }

  const best = useStorage(bestScoreKey, options.value?.score || 0)
  watch(
    () => options.value?.score,
    value => (best.value = Math.max(best.value, value))
  )

  const onMoved = useThrottleFn(
    (cmd: MoveCommand) => model.move(cmd),
    moveThrottle,
    true
  )
  useMoveCommand({ element, onMoved })

  function resume(data?: string) {
    try {
      model.init(JSON.parse(data ?? localStorage.getItem(prevStateKey) ?? ''))
    } catch {
      model.init()
    } finally {
      localStorage.removeItem(prevStateKey)
    }
  }

  return {
    gg,
    best,
    options,
    back: bindMethod(model.back, model),
    init: bindMethod(model.init, model),
    canIBack: bindMethod(model.canIBack, model),
    resume,
  }
}
