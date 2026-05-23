import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { viteBaseConfig } from './vite.config.base'

export default defineConfig({
  ...viteBaseConfig,
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/web-components.ts'),
      name: 'Node Graph',
      fileName: 'node-graph',
    },
  },
})
