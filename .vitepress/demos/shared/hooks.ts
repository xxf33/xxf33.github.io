import { ref, type MaybeRef } from 'vue'
import {
  tryOnUnmounted,
  tryOnScopeDispose,
  useEventListener,
  usePointerSwipe,
  type UseSwipeDirection,
} from '@vueuse/core'

export function usePageExit(callback: () => void) {
  let called = false
  const callbackWrapper = async () => {
    if (!called) {
      called = true
      callback()
    }
  }
  // https://developer.chrome.google.cn/docs/web-platform/page-lifecycle-api#overview_of_page_lifecycle_states_and_events
  useEventListener('pagehide', callbackWrapper)
  tryOnUnmounted(callbackWrapper)
}

export type MoveCommand = Exclude<UseSwipeDirection, 'none'>

const defaultMoveCommandMap: Record<string, MoveCommand> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  a: 'left',
  s: 'down',
  d: 'right',
}

export function useMoveCommand(options?: {
  enableKeyboardPress?: boolean
  enablePointerSwipe?: boolean
  element?: MaybeRef<HTMLElement | undefined | null>
  onMoved?: (cmd: MoveCommand) => Awaited<void>
  cmdMap?: Record<string, any>
}) {
  const {
    enableKeyboardPress = true,
    enablePointerSwipe = true,
    element,
    onMoved,
    cmdMap = defaultMoveCommandMap,
  } = options || {}

  const command = ref<UseSwipeDirection>('none')
  const stops: Array<() => void> = []

  if (enableKeyboardPress) {
    const stop = useEventListener('keydown', event => {
      const cmd = cmdMap[event.key]
      if (cmd) {
        event.preventDefault()
        onMoved?.(cmd)
      }
    })
    stops.push(stop)
  }
  if (enablePointerSwipe) {
    const { stop: stopSwipe } = usePointerSwipe(element, {
      threshold: 30,
      onSwipeEnd(event, cmd) {
        if (cmd !== 'none') {
          event.preventDefault()
          onMoved?.(cmd)
        }
      },
    })
    stops.push(stopSwipe)
  }

  const stop = () => stops.forEach(stop => stop())
  tryOnScopeDispose(stop)

  return {
    command,
    stop,
  }
}
