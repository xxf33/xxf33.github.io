import {
  defineConfig,
  presetIcons,
  presetWind3,
  presetAttributify,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: ['**/.vitepress/**/*.vue', '**/pages/**/*.md'],
    },
  },
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
      },
    }),
  ],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      brand: 'hsla(var(--brand) / <alpha-value>)',
    },
    fontFamily: {
      sans: `var(--vp-font-family-base)`,
      mono: `var(--vp-font-family-mono)`,
    },
  },
})
