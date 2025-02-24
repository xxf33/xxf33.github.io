<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'
import notesJson from '@/data/notes.json'
import { getSortedMarkdowns } from '../../utils/sort'
import { getNotesLink, parseNotesUrlHash } from '../../utils/link'
import NotesViewTabs from './notes-view-tabs.vue'
import NotesTagPanel from './notes-tag-panel.vue'
import NotesNavBlock from './notes-nav-block.vue'

defineOptions({
  name: 'Notes',
})

const viewTabs: Array<{ key: NotesView; text: string; icon: string }> = [
  { key: 'timeline', text: '时间线', icon: 'i-lucide-calendar' },
  { key: 'category', text: '文件夹', icon: 'i-lucide-folder-open' },
  { key: 'tags', text: '标签组', icon: 'i-lucide-tag' },
]
const activeViewIndex = ref(0)
const activeView = computed(() => viewTabs[activeViewIndex.value].key)

const sortedNotesByTag = getSortedMarkdowns(notesJson, 'tags')
const tags = sortedNotesByTag.map(({ label, items }) => ({
  tag: label,
  len: items.length,
}))
const activeTagIndex = ref(0)
const activeTag = computed(() => tags[activeTagIndex.value].tag)

function toggleTagIndex(offset: number) {
  const { length } = tags
  activeTagIndex.value = (activeTagIndex.value + offset + length) % length
}

const sortedNotes = computed(() => {
  if (activeView.value === 'tags') {
    return [sortedNotesByTag[activeTagIndex.value]]
  }
  return getSortedMarkdowns(notesJson, activeView.value)
})

const { hash } = useData()
watch(hash, onUrlHashChange, { immediate: true })
watch([activeView, activeTag], ([view, tag]) =>
  window.open(getNotesLink(view, tag), '_self')
)

function onUrlHashChange() {
  const { view, tag } = parseNotesUrlHash(hash.value)
  if (view) {
    activeViewIndex.value = viewTabs.findIndex(tab => tab.key === view)
  }
  if (tag) {
    activeTagIndex.value = tags.findIndex(t => t.tag === tag)
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-5 pb-20 pt-6 md:px-10">
    <div class="flex flex-col gap-6">
      <ClientOnly>
        <NotesViewTabs v-model="activeViewIndex" :tabs="viewTabs" />
        <NotesTagPanel
          v-if="activeView === 'tags'"
          v-model="activeTagIndex"
          :tags="tags"
        />
        <NotesNavBlock
          :notes="sortedNotes"
          :view="activeView"
          @toggleTagIndex="toggleTagIndex"
        />
      </ClientOnly>
    </div>
  </div>
</template>
