<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { formatDate } from '@vueuse/core'
import { getNotesLinkByTag } from '../../utils/link'

const { view } = defineProps<{
  notes: MarkdownMetaOrderList
  view: NotesView
}>()

defineEmits<{ toggleTagIndex: [offset: number] }>()

const showTags = computed(() => view === 'tags')
const showTimeline = computed(() => view === 'timeline')
const dateFormatStr = computed(() =>
  showTimeline.value ? 'M月D日' : 'YYYY/MM/DD'
)

const openLabelList = ref<{ [x: string]: boolean }>({})

function doCollapsing(event: ToggleEvent, key: string) {
  if (event.target instanceof HTMLDetailsElement) {
    openLabelList.value[key] = event.target.open
  }
}
</script>

<template>
  <div class="relative">
    <component
      :is="showTags ? 'div' : 'details'"
      v-for="({ label, items }, index) in notes"
      :key="label"
      :open="openLabelList[label] ?? true"
      class="mb-1 open:mb-6"
      @toggle="doCollapsing($event, label)"
    >
      <summary class="group h-12 flex items-center">
        <div class="text-xl font-bold">
          {{ label }}<span v-if="showTimeline" class="ml-1">年</span>
        </div>
        <div class="ml-auto flex gap-2">
          <template v-if="showTags">
            <button class="btn-icon" @click="$emit('toggleTagIndex', -1)">
              <i class="i-lucide-chevron-left" />
            </button>
            <button class="btn-icon" @click="$emit('toggleTagIndex', 1)">
              <i class="i-lucide-chevron-right" />
            </button>
          </template>
          <template v-else>
            <button
              :class="[
                'btn-icon group-hover:opacity-100 group-hover:bg-black/5 group-hover:dark:bg-white/10',
                openLabelList[label] && 'transform-rotate-90',
              ]"
              @click="openLabelList[label] = !openLabelList[label]"
            >
              <i class="i-lucide-chevron-right" />
            </button>
          </template>
        </div>
      </summary>

      <ul>
        <li
          v-for="(item, index) in items"
          :key="index"
          class="border-b border-b-dotted border-b-slate-300 dark:border-b-neutral-700 hover:border-b-solid"
        >
          <a
            :href="withBase(item.link)"
            class="group h-10 flex items-center gap-4"
          >
            <div
              class="dot relative z-1 h-full flex items-center justify-center"
              :class="showTimeline && index > 0 && 'line'"
            ></div>
            <div class="transition group-hover:text-brand">
              {{ item.title }}
            </div>
            <div
              :class="[
                'space-x-2',
                showTags ? 'flex ml-auto sm:ml-0' : 'hidden sm:flex',
                showTimeline ? 'ml-auto' : '',
              ]"
            >
              <a
                v-for="tag in item.tags"
                :key="tag"
                :href="getNotesLinkByTag(tag)"
                class="py-0.5 px-2 flex items-center justify-center rounded bg-gray-400/20 text-xs opacity-80 transition"
                hover="opacity-100 bg-gray-500/20"
                >#{{ tag }}</a
              >
            </div>
            <div
              :class="[
                'text-right text-sm font-mono',
                showTimeline ? 'order-first w-16' : 'ml-auto mr-4',
                showTags ? 'hidden sm:flex' : '',
              ]"
            >
              {{ formatDate(new Date(item.date), dateFormatStr) }}
            </div>
          </a>
        </li>
      </ul>
    </component>
  </div>
</template>

<style scoped>
details summary {
  cursor: pointer;
}

details summary::-webkit-details-marker {
  display: none;
}

.btn-icon {
  @apply flex items-center justify-center p-2.5 rounded-full text-base opacity-70 transition hover:opacity-100 hover:bg-black/5 hover:dark:bg-white/10;
}

.dot::before {
  @apply h-[5px] w-[5px] content-empty rounded-full bg-brand/90 transition-all duration-300 group-hover:h-4;
}

.dot.line::after {
  @apply content-empty absolute translate-x-[calc(50%-1px)] -top-50% h-full w-full border-l-2 border-l-dotted border-l-brand/40;
}
</style>
