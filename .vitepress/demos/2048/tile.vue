<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const { score } = defineProps<{ score: number }>()

const animateClass = ref<string | null>('tile-popup-no-delay')
const colorClass = computed(() => `tile-${score < 2048 ? score : 'super'}`)
watch(
  () => score,
  (_, oldValue) => (animateClass.value = oldValue ? 'tile-merge' : 'tile-popup')
)
</script>

<template>
  <div :class="[animateClass, colorClass]" @animationend="animateClass = null">
    <slot>{{ score }}</slot>
  </div>
</template>

<style scoped>
@import './tile.css';

.tile-popup-no-delay {
  animation: 0.15s ease popup;
}

.tile-popup {
  animation: 0.15s ease 0.15s popup;
}

.tile-merge {
  animation: 0.15s ease 0.15s merge;
}

@keyframes popup {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes merge {
  0%,
  100% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.2);
  }
}
</style>
