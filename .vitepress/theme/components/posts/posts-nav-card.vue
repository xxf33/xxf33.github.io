<script setup lang="ts">
import { withBase } from 'vitepress'
import { formatDate } from '@vueuse/core'

defineOptions({
  inheritAttrs: false,
})

defineProps<{
  link: string
  date: string
  title: string
  cover?: string[]
  description?: string
}>()
</script>

<template>
  <a
    :href="withBase(link)"
    class="group mx-auto w-full min-w-70 max-w-96 rounded-lg overflow-hidden shadow transition"
    hover="shadow-xl dark:shadow-[0_0_15px_rgba(255,255,255,0.2),0_0_3px_1px_rgba(255,255,255,0.15)]"
  >
    <div class="bottom-blur w-full aspect-video">
      <img
        v-if="cover?.length"
        :src="cover[0]"
        alt=""
        lazy="loaded"
        class="w-full h-full object-cover transition duration-1000 hover:scale-105"
      />
    </div>
    <div class="h-full p-3 text-$vp-c-text-2">
      <div class="flex items-center justify-between">
        <div class="transition text-$vp-c-text-1 group-hover:text-brand">
          {{ title }}
        </div>
        <div class="text-sm">
          {{ formatDate(new Date(date), 'YYYY/M/D') }}
        </div>
      </div>
      <div class="line-clamp-2 mt-3 text-sm">
        {{ description }}
      </div>
    </div>
  </a>
</template>

<style scoped>
.bottom-blur {
  mask-image: linear-gradient(to bottom, black 95%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 95%, transparent 100%);
}
</style>
