<script setup lang="ts">
import { useSlidingPuzzleModel } from './use-sliding-puzzle'

const { sliderList: sliderList$1, ...model$1 } = useSlidingPuzzleModel()
model$1.load({ w: 2, h: 2, idList: [2, 1, 3, 0] })
const { sliderList: sliderList$2, ...model$2 } = useSlidingPuzzleModel()
model$2.load({ w: 3, h: 3, idList: [1, 2, 3, 4, 5, 6, 8, 7, 0] })
</script>

<template>
  <div class="flex flex-wrap gap-x-40 gap-y-6">
    <div class="relative select-none h-41 w-41">
      <div
        v-for="{ id, x, y } in sliderList$1"
        :key="id"
        :style="{ transform: `translate(${x * 84}px, ${y * 84}px)` }"
        class="absolute h-20 w-20 flex items-center justify-center text-3xl shadow-sm border border-solid border-gray-500/20 rounded transition"
        hover="bg-gray-400/5"
        @click="model$1.move(id)"
      >
        {{ id }}
      </div>
    </div>
    <div class="relative select-none h-62 w-62">
      <div
        v-for="{ id, x, y } in sliderList$2"
        :key="id"
        :style="{ transform: `translate(${x * 84}px, ${y * 84}px)` }"
        class="absolute h-20 w-20 flex items-center justify-center text-3xl shadow-sm border border-solid border-gray-500/20 rounded transition"
        hover="bg-gray-400/5"
        @click="model$2.move(id)"
      >
        {{ id }}
      </div>
    </div>
  </div>
</template>
