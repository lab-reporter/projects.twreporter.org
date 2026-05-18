import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  compilerOptions: {
    warningFilter: (warning) =>
      warning.code !== 'options_missing_custom_element',
  },
  vitePlugin: {
    dynamicCompileOptions({ filename }) {
      if (filename.endsWith('.wc.svelte')) {
        return { customElement: true }
      }
    },
  },
}
