<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  useTemplateRef,
  watch,
  watchEffect,
} from 'vue'
import { useTimestamp } from '@vueuse/core'
import { usePageExit } from '../shared'
import { difficultyOptions, emojiPresets } from './config.json'
import { useMinesweeperModel } from './use-minesweeper'
import Block from './block.vue'
import Confetti from './confetti'

const { state, board, flagsNum, ...model } = useMinesweeperModel()

const showDialog = ref(false)
const storageKey = 'g-minesweeper-last-game'

usePageExit(() => {
  if (state.value === 'playing') {
    localStorage.setItem(storageKey, model.dump())
  }
})

watch(showDialog, v => {
  if (!v) {
    localStorage.removeItem(storageKey)
  }
})

onMounted(() => {
  const hash = location.hash.slice(1)
  if (hash) {
    tryResumeGame(atob(hash))
    return
  }
  if (localStorage.getItem(storageKey)) {
    showDialog.value = true
  } else {
    model.init()
  }
})

const stamp = useTimestamp()
const timer = ref(0)
watchEffect(() => {
  if (state.value === 'ready') {
    timer.value = 0
  } else if (state.value === 'playing') {
    const { start = stamp.value, duration } = model.timer.value
    timer.value = Math.floor((stamp.value - start + duration) / 1000)
  }
})

const difficulty = ref('easy')
function matchDifficulty(value?: string) {
  if (value) {
    const options = difficultyOptions.find(d => d.key === value)
    if (options) {
      difficulty.value = value
      model.init({ w: options.width, h: options.height, m: options.mines })
    }
  } else {
    const { w, h, m } = board.value
    const options = difficultyOptions.find(
      ({ width, height, mines }) => width === w && height === h && mines === m
    )
    if (options) {
      difficulty.value = options.key
    }
  }
}

function formatNumber(num: number) {
  return Math.min(999, Math.floor(num)).toString().padStart(3, '0')
}

function newGame() {
  model.init()
}

function tryResumeGame(data?: string) {
  try {
    data = data ?? localStorage.getItem(storageKey) ?? ''
    model.load(JSON.parse(data))
  } catch {
    model.init()
  } finally {
    showDialog.value = false
    matchDifficulty()
  }
}

async function shareCurrentGame() {
  const hash = btoa(model.dump())
  const url = location.origin + location.pathname + '/#' + hash
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    const input = document.createElement('input')
    input.value = url
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }
  alert('已拷贝当前局面数据到剪贴板')
}

const fastMode = ref(true)
const markMode = ref(false)
// watch(markMode, v => (fastMode.value = !v))

/* ----------------------------------- - ---------------------------------- */
const side = ref(33 /**px */)
const edge = ref(2 /**px */)

const blockBoard = useTemplateRef<HTMLElement>('blockBoard')
const pointerPos = ref({ x: 0, y: 0 })
const enableHighlight = ref(false)

const focusedBlock = computed(() => {
  const size = side.value + edge.value
  const pos = {
    x: Math.floor(pointerPos.value.x / size),
    y: Math.floor(pointerPos.value.y / size),
  }
  if (
    pointerPos.value.x - pos.x * size <= side.value &&
    pointerPos.value.y - pos.y * size <= side.value
  ) {
    return model.getBlock(pos)
  }
})
const hightedBlocks = computed(() => {
  if (!enableHighlight.value || !focusedBlock.value) {
    return []
  }
  return model.getHighlightedBlocks(focusedBlock.value)
})

function onPointerDown(event: PointerEvent) {
  if (blockBoard.value) {
    enableHighlight.value = event.buttons !== 2 && !markMode.value
    const rect = blockBoard.value.getBoundingClientRect()
    pointerPos.value = {
      x: event.clientX - rect.x,
      y: event.clientY - rect.y,
    }
    document.body.addEventListener('pointermove', onPointerMove)
    document.body.addEventListener('pointerup', onPointerUp)
    document.body.addEventListener('pointercancel', onPointerUp)
  }
}

function onPointerMove(event: PointerEvent) {
  const rect = blockBoard.value!.getBoundingClientRect()
  const x = event.clientX - rect.x
  const y = event.clientY - rect.y
  if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
    enableHighlight.value = false
  } else {
    enableHighlight.value = true
    pointerPos.value = { x, y }
  }
}

function onPointerUp() {
  enableHighlight.value = false
  document.body.removeEventListener('pointermove', onPointerMove)
  document.body.removeEventListener('pointerup', onPointerUp)
  document.body.removeEventListener('pointercancel', onPointerUp)
}

function onClick() {
  if (!focusedBlock.value) {
    return
  }
  markMode.value
    ? model.mark(focusedBlock.value, fastMode.value)
    : model.open(focusedBlock.value, fastMode.value)
}
</script>

<template>
  <div
    v-if="showDialog"
    class="mx-auto w-80 md:w-96 overflow-hidden rounded-lg bg-slate-100/60 p-8 text-center dark:bg-neutral-800/60"
  >
    <div class="mb-8 text-lg">恢复对局 🤔</div>
    <div class="mb-6 text-sm">有上次未完成的对局，是否继续？</div>
    <div class="flex items-center justify-center gap-5">
      <button
        class="h-8 w-20 bg-red-600/10 hover:bg-red-600/20"
        @click="showDialog = false"
      >
        <i class="i-lucide-x text-xl text-red-600 mr-1" />取消
      </button>
      <button
        class="h-8 w-20 bg-green-600/10 hover:bg-green-600/20"
        @click="tryResumeGame()"
      >
        <i class="i-lucide-check text-xl text-green-600 mr-1" />确认
      </button>
    </div>
  </div>

  <div v-else class="select-none text-center">
    <div class="min-w-80 max-w-full inline-flex flex-col gap-4">
      <div class="flex items-center">
        <button
          v-for="d in difficultyOptions"
          :key="d.key"
          :class="
            d.key === difficulty
              ? 'text-white bg-neutral-800 dark:text-neutral-800 dark:bg-neutral-100'
              : 'bg-black/5 dark:bg-neutral-800'
          "
          class="mr-2 text-sm w-14 h-8 !transition-none"
          @click="matchDifficulty(d.key)"
        >
          {{ d.text }}
        </button>
        <button
          class="ml-auto h-8 w-14"
          hover="bg-black/5 dark:bg-white/10"
          title="重玩本局"
          @click="model.restart()"
        >
          <i class="i-lucide-repeat-1" />
        </button>
      </div>

      <div class="flex items-center justify-between py-1">
        <div class="text-xl" title="还未标记的雷数目">
          {{ emojiPresets.mine }}
          <span class="text-red-500 font-bold font-mono">{{
            formatNumber(flagsNum)
          }}</span>
        </div>
        <button
          class="text-xl h-9 w-18"
          hover="bg-black/5 dark:bg-white/10"
          @click="newGame()"
        >
          {{ emojiPresets[state] }}
        </button>
        <div class="text-xl" title="本局已用时间">
          {{ emojiPresets.timer }}
          <span class="text-red-500 font-bold font-mono">{{
            formatNumber(timer)
          }}</span>
        </div>
      </div>

      <div class="max-w-full overflow-auto text-center">
        <div
          ref="blockBoard"
          :style="{ '--side': `${side}px`, '--edge': `${edge}px` }"
          class="relative flex flex-col gap-y-$edge"
          @pointerdown="onPointerDown"
          @click="onClick"
          @dblclick="focusedBlock && model.openAdjacent(focusedBlock)"
          @contextmenu.prevent="
            focusedBlock && model.mark(focusedBlock, fastMode)
          "
        >
          <div v-for="(_, y) in board.h" :key="y" class="flex gap-x-$edge">
            <div
              v-for="(__, x) in board.w"
              :key="x"
              class="h-$side w-$side shrink-0"
            >
              <Block
                class="h-full w-full rounded-sm overflow-hidden font-mono text-xl"
                :meta="model.getBlock({ x, y })"
                :highlight="
                  enableHighlight &&
                  hightedBlocks.includes(model.getBlock({ x, y }))
                "
              />
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-3">
        <label for="toggleFlag">
          <input id="toggleFlag" type="checkbox" v-model="markMode" />
          {{ emojiPresets.mark }}
        </label>
        <label for="toggleFast">
          <input id="toggleFast" type="checkbox" v-model="fastMode" />
          {{ emojiPresets.quick }}
        </label>
        <button
          class="ml-auto h-8 w-14"
          hover="bg-black/5 dark:bg-white/10"
          title="分享当前局面"
          @click="shareCurrentGame()"
        >
          <i class="i-lucide-share-2" />
        </button>
      </div>

      <Confetti :passed="state === 'won'" />
    </div>
  </div>
</template>

<style scoped>
button {
  @apply inline-flex items-center justify-center rounded-md border border-solid border-gray-300/60 dark:border-gray-500/20 transition;
}
</style>
