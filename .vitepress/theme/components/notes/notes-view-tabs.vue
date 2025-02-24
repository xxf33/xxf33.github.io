<script setup lang="ts">
defineProps<{
  tabs: Array<{ key: NotesView; text: string; icon: string }>
}>()

const activeIndex = defineModel({ default: 0 })
</script>

<template>
  <nav class="relative" :style="{ '--w': '6rem' }">
    <ul class="inline-flex rounded-lg p-1 bg-$vp-c-bg-soft">
      <li
        v-for="(item, index) in tabs"
        :class="
          activeIndex === index ? 'text-$vp-c-text-1' : 'text-$vp-c-text-2'
        "
        class="relative z-1 rounded-md bg-transparent transition"
      >
        <button
          class="h-8 w-$w flex items-center justify-center gap-2"
          @click="activeIndex = index"
        >
          <i :class="item.icon" /><span>{{ item.text }}</span>
        </button>
      </li>
    </ul>
    <div
      class="absolute inset-1 w-$w rounded-md bg-$vp-c-bg transition duration-200"
      :style="{ transform: `translateX(${activeIndex * 100}%)` }"
    ></div>
  </nav>
</template>
