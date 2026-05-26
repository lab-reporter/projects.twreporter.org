import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { viteBaseConfig } from './vite.config.base'

// https://vite.dev/config/
export default defineConfig({
  ...viteBaseConfig,
  base:
    process.env.RELEASE === 'production'
      ? '/twreporter/ddd/node-graph/js'
      : '/data-reporter-infographics/dev/node-graph/js',
  build: {
    rolldownOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        preview: resolve(__dirname, 'preview.html'),
      },
    },
  },
})
