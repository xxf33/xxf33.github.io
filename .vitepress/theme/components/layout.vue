<script setup lang="ts">
import DefaultTheme from 'vitepress/theme-without-fonts'
import DocHeader from './doc-header.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <DocHeader />
    </template>
  </DefaultTheme.Layout>
</template>
