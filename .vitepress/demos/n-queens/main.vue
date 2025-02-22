<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { useNQueensSolutions } from './use-n-queens'
import ChessBoard from './chess-board.vue'
import ChessQueen from './chess-queen.vue'

const inputN = ref(8)

const { isCalculating, timer, solutionIndex, ...model } =
  useNQueensSolutions(inputN)

function tryCalculate() {
  model.tryCalculate()
  resetLockedLines()
}

onMounted(() => {
  tryCalculate()
})

watch(inputN, n => {
  if (n !== model.boardN.value) {
    tryCalculate()
  }
})

const boardN = computed(() => model.boardN.value)
const queens = computed(() => model.activeSolution.value)
const loading = computed(() => isCalculating.value && timer.value > 150)

const carouselInterval = ref(3000)
const enableCarousel = ref(false)
const { resume: resumeCarousel, pause: pauseCarousel } = useIntervalFn(
  () => model.updateSolutionIndex(),
  carouselInterval,
  { immediate: false }
)
watch(enableCarousel, v => (v ? resumeCarousel() : pauseCarousel()))

const lockedLines = ref<number[]>([])
function updateLockedLines(x: number, y: number) {
  if (lockedLines.value[0] === x && lockedLines.value[1] === y) {
    resetLockedLines()
  } else {
    lockedLines.value = [x, y, x + y, x - y]
  }
}

function resetLockedLines() {
  lockedLines.value.length = 0
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center gap-4">
      <div class="text-2xl font-bold">N</div>
      <div class="text-2xl font-bold">=</div>
      <div class="flex">
        <input
          class="input-underline w-20 text-center text-xl"
          v-model.number="inputN"
          readonly
        />
        <button
          :disabled="inputN <= 3"
          class="ml-6 h-9 w-9 rounded-md"
          @click="inputN--"
        >
          <i class="i-lucide-minus" />
        </button>
        <button
          :disabled="inputN >= 15"
          class="ml-2 h-9 w-9 rounded-md"
          @click="inputN++"
        >
          <i class="i-lucide-plus" />
        </button>
      </div>
    </div>

    <div class="mt-5 flex gap-2 text-sm">
      找到
      <div class="input-underline min-w-16 text-center font-mono">
        {{ loading ? '?' : model.solutionLength }}
      </div>
      种摆法，用时
      <div class="input-underline min-w-16 text-center font-mono">
        {{ (Math.max(timer, 10) / 1000).toFixed(2) }}
      </div>
      秒
    </div>

    <div class="mt-5 max-w-full overflow-auto select-none">
      <div class="relative inline-flex">
        <ChessBoard :n="boardN" class="rounded-md" @tap="updateLockedLines">
          <template #board-layer="{ x, y }">
            <div
              class="h-full w-full flex items-center justify-center text-xs border-dashed border-neutral-700"
              :class="
                x === lockedLines[0] && y == lockedLines[1]
                  ? 'border-2'
                  : 'border-0'
              "
            >
              <i
                v-show="
                  !(x === lockedLines[0] && y === lockedLines[1]) &&
                  (x === lockedLines[0] ||
                    y === lockedLines[1] ||
                    x + y === lockedLines[2] ||
                    x - y === lockedLines[3]) &&
                  queens[y] !== x
                "
                class="i-lucide-lock text-neutral-700"
              />
            </div>
          </template>
          <template #chess-layer>
            <ChessQueen
              v-for="(x, y) in queens"
              :style="{
                '--x': `calc(var(--side) * ${x})`,
                '--y': `calc(var(--side) * ${y})`,
              }"
              class="absolute h-$side w-$side translate-x-$x translate-y-$y shadow-md text-[calc(var(--side)*0.75)] transition-transform duration-300"
              :class="
                x === lockedLines[0] ||
                y === lockedLines[1] ||
                x + y === lockedLines[2] ||
                x - y === lockedLines[3]
                  ? 'text-red-600'
                  : 'text-neutral-800'
              "
              @click="updateLockedLines(x, y)"
            ></ChessQueen>
          </template>
        </ChessBoard>
        <Transition name="fade">
          <div
            v-if="loading"
            class="absolute inset-0 flex items-center justify-center rounded-lg text-3xl bg-white/60 dark:bg-black/70"
          >
            <i class="i-lucide-loader-circle animate-spin" />
          </div>
        </Transition>
      </div>
    </div>

    <div
      v-if="model.solutionLength.value > 0"
      :class="loading ? 'invisible' : 'visible'"
      class="mt-2 flex items-center gap-x-3"
    >
      <button
        class="relative p-2.5 rounded-full text-base"
        @click="enableCarousel = !enableCarousel"
      >
        <i :class="enableCarousel ? 'i-lucide-pause' : 'i-lucide-play'" />
      </button>
      <div v-if="enableCarousel" class="mt-2 text-xs animate-bounce">
        正在展示...
      </div>
      <div class="flex items-center gap-x-1 text-xs">
        第
        <div class="flex items-center h-8">
          <button
            class="h-full aspect-square rounded-l-md"
            @click="model.updateSolutionIndex(solutionIndex - 1)"
          >
            <i class="i-lucide-skip-back" />
          </button>
          <input
            v-model.number.lazy="solutionIndex"
            class="h-full w-20 text-sm text-center font-mono"
            border="solid t b gray-400/30 dark:gray-500/30"
            @change="model.updateSolutionIndex(solutionIndex)"
          />
          <button
            class="h-full aspect-square rounded-r-md"
            @click="model.updateSolutionIndex()"
          >
            <i class="i-lucide-skip-forward" />
          </button>
        </div>
        种摆法
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  @apply flex items-center justify-center border border-solid border-gray-300/60 dark:border-gray-500/30 enabled:hover:bg-black/5 dark:enabled:hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed;
}

.input-underline {
  @apply border-b border-b-solid border-b-gray-300/60 dark:border-b-gray-500/30;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
