import { computed, reactive, toRefs } from 'vue'
import { MinesweeperModel, type BlockProps, type Position } from './model'
import { bindMethod } from '../shared'

export function useMinesweeperModel() {
  const m = reactive(new MinesweeperModel())
  const { state, board, timer } = toRefs(m)
  const flagsNum = computed(() => board.value.m - m.markUidSet.size)
  const getBlock = (pos: Position) => m.blocks[m.posToUid(pos)]
  const getHighlightedBlocks = (block: BlockProps) => {
    if (block.mark) {
      return []
    }
    if (!block.open) {
      return [block]
    }
    return m.getSiblings(block.uid).reduce((acc, uid) => {
      const block = m.blocks[uid]
      if (!block.open && !block.mark) {
        acc.push(block)
      }
      return acc
    }, [] as BlockProps[])
  }

  return {
    state,
    board,
    timer,
    flagsNum,
    getBlock,
    getHighlightedBlocks,
    init: bindMethod(m.init, m),
    load: bindMethod(m.load, m),
    dump: bindMethod(m.dump, m),
    restart: bindMethod(m.restart, m),
    open: bindMethod(m.open, m),
    mark: bindMethod(m.mark, m),
    openAdjacent: bindMethod(m.openAdjacent, m),
  }
}
