<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue'
import { useG2048 } from './use-2048'
import Tile from './tile.vue'

const tilesBoard = useTemplateRef('tilesBoard')
const scorePanel = useTemplateRef('scorePanel')
const scoreToastTpl = useTemplateRef('scoreToastTpl')

const size = ref(4)
const { gg, best, options, canIBack, ...model } = useG2048(tilesBoard)

onMounted(() => model.resume())

function newGame() {
  model.init({ boardWidth: size.value })
}

const scoreLabel = ref(options.value.score)
watch(
  () => options.value.score,
  (value, oldValue) => {
    if (oldValue && value > oldValue) {
      playScoreIncAnimation(oldValue, value - oldValue)
    } else {
      scoreLabel.value = value
    }
  }
)

function playScoreIncAnimation(from: number, delta: number) {
  let raf = window.requestAnimationFrame
  let startTimestamp: number
  const step = (timestamp: number) => {
    startTimestamp = startTimestamp ?? timestamp
    const progress = Math.min(1, (timestamp - startTimestamp) / 300)
    if (progress < 1) {
      scoreLabel.value = from + Math.floor(delta * progress)
      raf(step)
    }
  }
  raf(step)
  if (scorePanel.value && scoreToastTpl.value) {
    let toast = scoreToastTpl.value.cloneNode(true) as HTMLElement | null
    if (toast) {
      toast.textContent = `+${delta}`
      toast.classList.remove('hidden')
      toast.addEventListener('animationend', () => {
        toast?.remove()
        toast = null
      })
      scorePanel.value.append(toast)
    }
  }
}
</script>

<template>
  <div class="g-2048 select-none text-center">
    <div class="inline-flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <div class="text-5xl font-bold">2048</div>
        <div class="flex gap-2">
          <div
            class="relative w-24 rounded-md py-1 text-center text-[#eee4da] bg-[#bbada0] dark:bg-[#9b8776]"
          >
            <div class="text-sm opacity-90">最佳</div>
            <div class="text-lg text-white font-bold">{{ best }}</div>
          </div>
          <div
            class="relative w-24 rounded-md py-1 text-center text-[#eee4da] bg-[#bbada0] dark:bg-[#9b8776]"
            ref="scorePanel"
          >
            <div class="text-sm opacity-90">得分</div>
            <div class="text-lg text-white font-bold">{{ scoreLabel }}</div>
            <div
              class="toast-up hidden absolute right-1 bottom-0 text-xl text-white font-bold"
              ref="scoreToastTpl"
            ></div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="text-sm opacity-90 underline underline-offset-2">
          移动方块🎯组合出 2048
        </div>
        <div
          class="ml-auto h-11 w-24 flex items-center justify-center rounded-md text-white font-bold bg-[#8f7a6d] dark:bg-[#776359]"
          hover="cursor-pointer"
          @click="newGame"
        >
          新游戏
        </div>
      </div>

      <div
        ref="tilesBoard"
        :style="{ '--size': size }"
        class="relative rounded-lg p-$edge bg-[#bbada0] dark:bg-[#9b8776]"
      >
        <div class="grid grid-cols-[repeat(var(--size),1fr)] gap-$edge">
          <div
            v-for="_ in size * size"
            class="h-$side w-$side rounded bg-[#cdc1b4] dark:bg-[#bdac97]"
          ></div>
        </div>
        <div class="absolute inset-$edge">
          <div
            v-for="t in options.tiles"
            :key="t.id"
            :style="{
              '--x': `calc(var(--side) * ${t.x} + var(--edge) * ${t.x})`,
              '--y': `calc(var(--side) * ${t.y} + var(--edge) * ${t.y})`,
            }"
            class="h-$side w-$side text-[calc(var(--side)*0.4)] translate-x-$x translate-y-$y absolute transition"
          >
            <Tile
              :score="1 << t.level"
              class="h-full w-full flex items-center justify-center rounded font-bold"
            />
          </div>
        </div>
        <Transition name="gg">
          <div
            v-if="gg"
            class="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-black/70"
          >
            <div class="mb-6 text-5xl font-bold">Game Over</div>
            <div
              class="px-5 py-2 rounded-md text-lg text-white font-bold bg-[#8f7a6d] dark:bg-[#776359]"
              hover="cursor-pointer"
              @click="newGame"
            >
              再来
            </div>
          </div>
        </Transition>
      </div>

      <div class="relative min-h-12 w-full flex items-center justify-center">
        <div
          class="h-10 w-20 rounded-md flex items-center justify-center transition"
          :class="
            canIBack()
              ? 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/10'
              : 'cursor-not-allowed opacity-50'
          "
          title="回退一步"
          @click="model.back"
        >
          <i class="i-lucide-undo text-lg" />
        </div>
        <div class="absolute right-1 text-sm opacity-90">
          moves: {{ options.times }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.g-2048 {
  --side: 4.5rem;
  --edge: 0.5rem;
}

@media (min-width: 640px) {
  .g-2048 {
    --side: 5rem;
  }
}

@media (min-width: 960px) {
  .g-2048 {
    --side: 5.5rem;
    --edge: 0.7rem;
  }
}

.toast-up {
  animation: 1s ease-out slider-up forwards;
}

@keyframes slider-up {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  20% {
    opacity: 1;
    transform: translateY(-10px);
  }
  100% {
    opacity: 0;
    transform: translateY(-70px);
  }
}

.gg-enter-from {
  opacity: 0;
  transform: scale(0.85);
}

.gg-enter-active {
  transition: all 0.5s ease 1s;
}
</style>
