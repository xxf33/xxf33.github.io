<script setup lang="ts">
defineProps<{
  tags: Array<{ tag: string; len?: number }>
}>()

const activeIndex = defineModel({ default: 0 })
</script>

<template>
  <div class="relative">
    <div class="flex flex-wrap gap-x-6 gap-y-1">
      <button
        v-for="(item, index) in tags"
        :class="
          activeIndex === index
            ? 'text-$vp-c-brand-1 underline-current'
            : 'text-$vp-c-text-2 underline-transparent'
        "
        class="relative p-2 underline underline-offset-4 transition hover:text-$vp-c-brand-1"
        @click="activeIndex = index"
      >
        {{ item.tag }}
        <span v-if="item.len" class="absolute top-1 -right-1">{{
          item.len
        }}</span>
      </button>
    </div>
  </div>
</template>
