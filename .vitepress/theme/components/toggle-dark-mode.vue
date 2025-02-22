<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<template>
  <button
    class="flex items-center justify-center p-3 rounded-full transition"
    hover="bg-black/5 dark:bg-white/10"
    @click="isDark = !isDark"
  >
    <i v-if="isDark" class="icon-moon" />
    <i v-else class="icon-sun" />
  </button>
</template>

<style scoped>
i {
  -webkit-mask: var(--un-icon) no-repeat;
  mask: var(--un-icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  background-color: currentColor;
  width: 1.2rem;
  height: 1.2rem;
}

.icon-sun {
  --un-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='currentColor' stroke-linecap='round' stroke-width='2'%3E%3Ccircle cx='12' cy='32' r='5'%3E%3Canimate fill='freeze' attributeName='cy' dur='0.6s' values='32;12'/%3E%3C/circle%3E%3Cg stroke-dasharray='2' stroke-dashoffset='2'%3E%3Cpath d='M0 0'%3E%3Canimate fill='freeze' attributeName='d' begin='0.7s' dur='0.2s' values='M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1'/%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.7s' dur='0.2s' values='2;0'/%3E%3C/path%3E%3Cpath d='M0 0'%3E%3Canimate fill='freeze' attributeName='d' begin='0.9s' dur='0.2s' values='M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5'/%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.9s' dur='0.2s' values='2;0'/%3E%3C/path%3E%3CanimateTransform attributeName='transform' dur='30s' repeatCount='indefinite' type='rotate' values='0 12 12;360 12 12'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.icon-moon {
  --un-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cg fill='currentColor' fill-opacity='0'%3E%3Cpath d='m15.22 6.03l2.53-1.94L14.56 4L13.5 1l-1.06 3l-3.19.09l2.53 1.94l-.91 3.06l2.63-1.81l2.63 1.81z'%3E%3Canimate id='lineMdMoonRisingLoop0' fill='freeze' attributeName='fill-opacity' begin='0.7s;lineMdMoonRisingLoop0.begin+6s' dur='0.4s' values='0;1'/%3E%3Canimate fill='freeze' attributeName='fill-opacity' begin='lineMdMoonRisingLoop0.begin+2.2s' dur='0.4s' values='1;0'/%3E%3C/path%3E%3Cpath d='M13.61 5.25L15.25 4l-2.06-.05L12.5 2l-.69 1.95L9.75 4l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z'%3E%3Canimate fill='freeze' attributeName='fill-opacity' begin='lineMdMoonRisingLoop0.begin+3s' dur='0.4s' values='0;1'/%3E%3Canimate fill='freeze' attributeName='fill-opacity' begin='lineMdMoonRisingLoop0.begin+5.2s' dur='0.4s' values='1;0'/%3E%3C/path%3E%3Cpath d='M19.61 12.25L21.25 11l-2.06-.05L18.5 9l-.69 1.95l-2.06.05l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z'%3E%3Canimate fill='freeze' attributeName='fill-opacity' begin='lineMdMoonRisingLoop0.begin+0.4s' dur='0.4s' values='0;1'/%3E%3Canimate fill='freeze' attributeName='fill-opacity' begin='lineMdMoonRisingLoop0.begin+2.8s' dur='0.4s' values='1;0'/%3E%3C/path%3E%3Cpath d='m20.828 9.731l1.876-1.439l-2.366-.067L19.552 6l-.786 2.225l-2.366.067l1.876 1.439L17.601 12l1.951-1.342L21.503 12z'%3E%3Canimate fill='freeze' attributeName='fill-opacity' begin='lineMdMoonRisingLoop0.begin+3.4s' dur='0.4s' values='0;1'/%3E%3Canimate fill='freeze' attributeName='fill-opacity' begin='lineMdMoonRisingLoop0.begin+5.6s' dur='0.4s' values='1;0'/%3E%3C/path%3E%3C/g%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z' transform='translate(0 22)'%3E%3CanimateMotion fill='freeze' calcMode='linear' dur='0.6s' path='M0 0v-22'/%3E%3C/path%3E%3C/svg%3E");
}
</style>
