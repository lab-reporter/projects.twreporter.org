import { svelte } from '@sveltejs/vite-plugin-svelte'
import { fileURLToPath, URL } from 'node:url'
import type { UserConfig } from 'vite'

export const viteBaseConfig: UserConfig = {
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~convex': fileURLToPath(new URL('./convex/_generated', import.meta.url)),
    },
  },
  plugins: [
    svelte({
      emitCss: false,
      dynamicCompileOptions({ filename }) {
        if (filename.endsWith('.wc.svelte')) {
          return { customElement: true }
        }
      },
    }),
  ],
}
