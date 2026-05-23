import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { viteBaseConfig } from './vite.config.base'

export default defineConfig({
  ...viteBaseConfig,
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/web-components.ts'),
      formats: ['umd'],
      name: 'Node Graph',
      fileName: () => 'node-graph.js',
    },
  },
})
