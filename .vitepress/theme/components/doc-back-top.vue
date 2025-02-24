<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { triggerY = 650 } = defineProps<{
  triggerY?: number
}>()

const { y } = useWindowScroll({ behavior: 'smooth' })
</script>

<template>
  <button
    title="返回顶部"
    class="hidden sm:flex fixed bottom-6 right-6 z-10 rounded-full p-3 text-base transition"
    hover="opacity-100 bg-black/5 dark:bg-white/10"
    active="scale-105"
    :class="y > triggerY ? 'opacity-60' : '!opacity-0 pointer-events-none'"
    @click="y = 0"
  >
    <i class="i-lucide-arrow-up" />
  </button>
</template>
