import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  base:
    process.env.RELEASE === 'prod'
      ? '/twreporter/ddd/node-graph/js'
      : '/data-reporter-infographics/dev/node-graph/js',
  plugins: [
    svelte({
      emitCss: false,
    }),
  ],
})
