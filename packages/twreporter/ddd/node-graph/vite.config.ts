import { svelte } from '@sveltejs/vite-plugin-svelte'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base:
    process.env.RELEASE === 'prod'
      ? '/twreporter/ddd/node-graph/js'
      : '/data-reporter-infographics/dev/node-graph/js',
  resolve: {
    alias: {
      '~convex': fileURLToPath(new URL('./convex/_generated', import.meta.url)),
    },
  },
  plugins: [
    svelte({
      emitCss: false,
      compilerOptions: {
        customElement: true,
      },
    }),
  ],
})
