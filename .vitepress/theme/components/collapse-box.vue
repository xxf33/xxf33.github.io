<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'CollapseBox',
})

const {
  position = 'bottom',
  btnText = '展开',
  btnIcon = 'i-lucide-lightbulb',
} = defineProps<{
  position?: 'top' | 'bottom'
  btnText?: string
  btnIcon?: string
}>()

const open = defineModel({ default: false })
const text = computed(() => (open.value ? '收起' : btnText))
const icon = computed(() =>
  open.value
    ? position === 'bottom'
      ? 'i-lucide-chevron-down'
      : 'i-lucide-chevron-up'
    : btnIcon
)
</script>

<template>
  <div class="flex flex-col">
    <div class="relative select-none">
      <hr class="absolute w-full" />
      <div class="relative mx-auto w-[70%] max-w-84">
        <button
          class="h-8 w-full flex items-center justify-center gap-2 rounded-full border bg-white dark:bg-neutral-800 transition"
          hover="bg-slate-100 dark:bg-neutral-700"
          active="scale-105"
          @click="open = !open"
        >
          {{ text }}<i :class="icon" />
        </button>
      </div>
      <div v-if="open" :class="position === 'top' && 'order-first'">
        <slot />
      </div>
    </div>
  </div>
</template>
