<script setup lang="ts">
import { computed } from 'vue'
import { formatDate, formatTimeAgo } from '@vueuse/core'
import { useData } from 'vitepress'
import { getNotesLinkByTag } from '../utils/link'

const { frontmatter: fm } = useData()

const data = computed(() => {
  let ctime = ''
  let mtime = ''
  const { key, title, date, tags, lastUpdatedTime } = fm.value
  const center = key === 'posts'
  if (date) {
    ctime = center
      ? formatDate(new Date(date), 'YYYY年M月D日', { locales: 'zh-CN' })
      : formatDate(new Date(date), 'MMM D, YYYY', { locales: 'en' })
  }
  if (!center && lastUpdatedTime) {
    mtime = formatTimeAgo(new Date(lastUpdatedTime))
  }
  return {
    center,
    title,
    ctime,
    mtime,
    tags,
  }
})
</script>

<template>
  <div
    v-if="data"
    :class="['mb-7 flex flex-col', data.center && 'items-center']"
  >
    <h1 v-if="data.title" class="mb-4 text-3xl font-bold">{{ data.title }}</h1>
    <ul class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-$vp-c-text-2">
      <li
        v-if="data.ctime"
        class="flex items-center gap-1"
        title="本文发布日期"
      >
        <i class="i-lucide-calendar" />{{ data.ctime }}
      </li>
      <li
        v-if="data.mtime"
        class="flex items-center gap-1"
        title="距离上次修改"
      >
        <i class="i-lucide-file-pen" />{{ data.mtime }}
      </li>
      <li v-if="data.tags" class="flex items-center">
        <template v-for="(tag, index) in data.tags" :key="index">
          <a
            :href="getNotesLinkByTag(tag)"
            class="peer hover:text-$vp-c-brand-1 transition"
            >{{ tag }}</a
          >
          <i v-if="index !== data.tags.length - 1" class="ml-0.5 mr-2.5">,</i>
        </template>
        <i
          class="order-first mr-1 peer-hover:text-$vp-c-brand-1"
          :class="data.tags.length > 1 ? 'i-lucide-tags' : 'i-lucide-tag'"
        />
      </li>
    </ul>
  </div>
</template>
