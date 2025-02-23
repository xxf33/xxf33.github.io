<script setup lang="ts">
import { computed } from 'vue'
import { emojiPresets, numberColors } from './config.json'
import type { BlockProps } from './model'

const { meta, highlight } = defineProps<{
  meta: BlockProps
  highlight?: boolean
}>()

const txt = computed(() => {
  if (meta.mark) return emojiPresets.mark
  if (meta.boom) return emojiPresets.boom
  if (meta.open && meta.mine) return emojiPresets.mine
  if (meta.open && meta.adjacentMines) return meta.adjacentMines
})

const cls = computed(() => {
  if (meta.boom) return 'bg-red-600/70'
  if (!meta.open && !highlight)
    return 'bg-gray-600/10 dark:bg-gray-500/10 transition hover:border-transparent hover:bg-gray-600/20 dark:hover:bg-gray-500/20'
})

const styles = computed(() => {
  if (meta.open && meta.adjacentMines)
    // @ts-ignore
    return { color: numberColors[meta.adjacentMines] }
})

const isMarkedError = computed(() => meta.mark && meta.open && !meta.mine)
</script>

<template>
  <div
    class="relative border border-solid border-gray-300/60 dark:border-gray-500/20"
  >
    <b :class="cls" :style="styles">{{ txt }}</b>
    <b v-if="isMarkedError" class="absolute inset-0 bg-red-600/20">
      {{ emojiPresets.wrong }}
    </b>
  </div>
</template>

<style scoped>
b {
  @apply h-full w-full flex items-center justify-center;
}
</style>
