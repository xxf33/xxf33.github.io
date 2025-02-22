import { defineConfig } from 'vitepress'
import unocss from 'unocss/vite'
import { sidebar } from './sidebar'
import { injectFrontmatter } from './frontmatter'
import { tsConfigPaths, vpComponentAlias } from './alias'

export default defineConfig({
  srcDir: 'pages',
  outDir: 'dist',
  cacheDir: 'node_modules/.vitepress_cache',
  cleanUrls: true,

  title: '小凡の网络日志',
  description: '这个人很懒，什么都没有留下',
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  ],

  themeConfig: {
    sidebar,
    logo: {
      light: '/sherry.jpg',
      dark: '/bonfire.jpg',
    },
    nav: [
      { text: '日常', link: '/posts/', activeMatch: '^/posts/' },
      { text: '笔记', link: '/notes/', activeMatch: '^/notes/' },
      { text: '关于', link: '/about' },
    ],
    outline: { label: '在本页', level: [2, 3] },
    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '深色模式',
    externalLinkIcon: true,
  },

  vite: {
    resolve: {
      alias: [...tsConfigPaths, ...vpComponentAlias],
    },
    plugins: [unocss()],
  },

  transformPageData({ frontmatter, relativePath }) {
    return {
      frontmatter: {
        ...injectFrontmatter(relativePath),
        ...frontmatter,
      },
    }
  },
})
