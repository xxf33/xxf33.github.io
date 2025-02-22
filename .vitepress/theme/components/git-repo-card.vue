<script setup lang="ts">
import { useIntersectionObserver, formatTimeAgo } from '@vueuse/core'
import { computed, ref, useTemplateRef } from 'vue'
import { ofetch } from 'ofetch'
import ReposJson from '@/data/repos.json'

defineOptions({
  name: 'GitRepoCard',
})

const { endPoint } = defineProps<{
  endPoint: string
}>()

const data = ref()
const state = ref<'loading' | 'error' | 'success'>('loading')
const repoInfo = computed(() => [
  { icon: 'i-lucide-file-code', text: data.value?.language },
  { icon: 'i-lucide-star', text: data.value?.stargazers_count },
  { icon: 'i-lucide-git-fork', text: data.value?.forks_count },
  data.value.timestamp
    ? {
        icon: 'i-lucide-history',
        text: formatTimeAgo(new Date(data.value.timestamp)),
        title: '当前数据更新于',
      }
    : {
        icon: 'i-lucide-git-pull-request-create',
        text: formatTimeAgo(new Date(data.value.pushed_at)),
        title: '最近一个PR提交于',
      },
])

const target = useTemplateRef('target')
const { stop } = useIntersectionObserver(
  target,
  async ([{ isIntersecting }]) => {
    if (isIntersecting) {
      stop()
      try {
        const resp = await fetchGitRepoData(endPoint)
        data.value = formatResponse(resp)
        state.value = 'success'
      } catch {
        state.value = 'error'
      }
    }
  }
)

async function fetchGitRepoData(endPoint: string) {
  let resp: Record<string, any>
  try {
    const url = `https://api.github.com/repos/${endPoint}`
    const options = {
      timeout: 5000,
      headers: {
        Accept: 'application/vnd.github.v4+json',
      },
    }
    resp = await ofetch(url, options)
  } catch {
    resp = ReposJson[endPoint as keyof typeof ReposJson] ?? {}
  }
  return resp
}

function formatResponse(res: Record<string, any>) {
  const formatNumber = (num: number) =>
    num > 999 ? `${(num / 1000).toFixed(1)}k` : num.toString()
  return {
    timestamp: res.timestamp,
    html_url: res.html_url,
    avatar_url: res.avatar_url ?? res.owner?.avatar_url,
    description: res.description,
    language: res.language ?? 'Other',
    stargazers_count: formatNumber(res.stargazers_count),
    forks_count: formatNumber(res.forks_count),
    pushed_at: res.pushed_at,
  }
}
</script>

<template>
  <div ref="target" class="overflow-hidden rounded-lg border">
    <div
      v-if="state === 'loading'"
      class="h-28 bg-slate-200 dark:bg-neutral-700 animate-pulse"
    ></div>
    <div v-else-if="state === 'error'"></div>
    <div v-else-if="state === 'success'" class="relative p-4">
      <div class="-z-1 absolute right-4 top-4">
        <i class="i-lucide-github text-2xl opacity-40" />
      </div>
      <div class="mb-2 flex items-center gap-2">
        <img :src="data.avatar_url" class="h-7 w-7 rounded-full" />
        <a :href="data.html_url" target="_blank" rel="noopener noreferrer">
          {{ endPoint }}
        </a>
      </div>
      <div class="mb-4 break-words text-sm">{{ data.description }}</div>
      <div class="flex flex-wrap items-center gap-x-7 gap-y-2">
        <div
          v-for="repo in repoInfo"
          :title="repo?.title"
          class="flex items-center gap-1 text-xs text-$vp-c-text-2"
        >
          <i :class="repo.icon" />{{ repo.text }}
        </div>
      </div>
    </div>
  </div>
</template>
