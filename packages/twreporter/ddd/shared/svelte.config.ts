import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import type { SvelteConfig as Config } from '@sveltejs/vite-plugin-svelte'

const config: Config = {
  preprocess: vitePreprocess(),
  onwarn: (warning, defaultHandler) => {
    if (warning.code !== 'options_missing_custom_element')
      defaultHandler(warning)
  },
  vitePlugin: {
    dynamicCompileOptions: ({ filename }) =>
      filename.endsWith('.wc.svelte') ? { customElement: true } : undefined,
  },
}

export default config
