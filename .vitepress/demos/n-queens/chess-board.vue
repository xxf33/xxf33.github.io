<script setup lang="ts">
const {
  n = 8,
  side = 35,
  edge = 30,
  colors = ['#ffcf9f', '#d28c45'],
} = defineProps<{
  n?: number
  side?: number
  edge?: number
  colors?: [string, string]
}>()

defineEmits<{
  (e: 'tap', x: number, y: number): void
}>()

const squareList = [
  {
    key: 'left',
    outerClass: 'left-0 top-$edge flex-col',
    innerClass: 'h-$side w-$edge',
    text: (index: number) => n - index,
  },
  {
    key: 'right',
    outerClass: 'right-0 top-$edge flex-col',
    innerClass: 'h-$side w-$edge',
    text: (index: number) => n - index,
  },
  {
    key: 'top',
    outerClass: 'top-0 left-$edge',
    innerClass: 'h-$edge w-$side',
    text: (index: number) => String.fromCodePoint(index + 97 /** 'a' ascii */),
  },
  {
    key: 'bottom',
    outerClass: 'bottom-0 left-$edge',
    innerClass: 'h-$edge w-$side',
    text: (index: number) => String.fromCodePoint(index + 97),
  },
]
</script>

<template>
  <div
    :style="{
      '--side': `${side}px`,
      '--edge': `${edge}px`,
      '--w': `${side * n + edge * 2}px`,
      '--h': `${side * n + edge * 2}px`,
    }"
    class="h-$h w-$w relative bg-slate-100 dark:bg-neutral-800"
  >
    <div class="absolute inset-0">
      <div
        v-for="square in squareList"
        :key="square.key"
        :class="['absolute flex', square.outerClass]"
      >
        <div
          v-for="i in n"
          :class="[
            'flex items-center justify-center text-sm opacity-90 font-mono',
            square.innerClass,
          ]"
        >
          {{ square.text(i - 1) }}
        </div>
      </div>
    </div>
    <div class="absolute inset-$edge">
      <div v-for="y in n" :key="y" class="relative flex">
        <div
          v-for="x in n"
          :key="x"
          :style="{ backgroundColor: colors[(x + y) % 2] }"
          class="h-$side w-$side shrink-0"
          @click="$emit('tap', x - 1, y - 1)"
        >
          <slot name="board-layer" :x="x - 1" :y="y - 1" />
        </div>
      </div>
      <div class="absolute left-0 top-0">
        <slot name="chess-layer" />
      </div>
    </div>
  </div>
</template>
