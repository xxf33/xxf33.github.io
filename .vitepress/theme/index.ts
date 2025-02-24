/// <reference types="vitepress/client" />

import { h, type Component } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import DocHeader from './components/doc-header.vue'
import './styles/main.css'
import 'uno.css'

export default {
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'doc-before': () => h(DocHeader),
    }),
  enhanceApp(ctx) {
    const modules = import.meta.glob<Component>(['./components/**/*.vue'], {
      import: 'default',
      eager: true,
    })
    Object.values(modules).forEach(module => {
      if (module.name) {
        ctx.app.component(module.name, module)
      }
    })
  },
} satisfies Theme
