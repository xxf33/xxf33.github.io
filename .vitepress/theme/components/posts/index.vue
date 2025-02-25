<script setup lang="ts">
import PostsNavCard from './posts-nav-card.vue'
import PostsJson from '@/data/posts.json'

defineOptions({
  name: 'Posts',
})
</script>

<template>
  <div class="mx-auto max-w-7xl flex flex-col items-center px-5 pb-20 md:px-10">
    <nav
      v-if="false"
      class="sticky my-4 top-16 h-12 w-full z-10 text-center"
    ></nav>
    <div
      class="mt-4 w-full grid gap-x-5 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr"
    >
      <PostsNavCard v-for="posts in PostsJson" v-bind="posts" />
    </div>
  </div>
</template>
