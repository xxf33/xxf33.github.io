<script setup lang="ts">
import { defineAsyncComponent, type AsyncComponentLoader } from 'vue'

defineOptions({
  name: 'DemoWrapper',
})

const { client = true } = defineProps<{
  loader?: AsyncComponentLoader
  client?: boolean
}>()
</script>

<template>
  <div class="relative my-4 w-full max-w-full overflow-hidden">
    <Component v-if="loader" :is="defineAsyncComponent(loader)" />
    <ClientOnly v-else-if="client"><slot></slot></ClientOnly>
    <slot v-else></slot>
  </div>
</template>
