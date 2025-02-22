/// <reference types="vitepress/client" />

import type { Component } from 'vue'
import type { Theme } from 'vitepress'
import Layout from './components/layout.vue'
import './styles/main.css'
import 'uno.css'

export default {
  Layout,
  enhanceApp(ctx) {
    const modules = import.meta.glob<Component>(['./components/**/*.vue'], {
      import: 'default',
      eager: true,
    })
    Object.values(modules).forEach(item => {
      if (item.name) {
        ctx.app.component(item.name, item)
      }
    })
  },
} satisfies Theme
