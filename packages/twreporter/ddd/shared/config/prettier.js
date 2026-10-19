import { fileURLToPath } from 'node:url'

export default {
  jsxSingleQuote: true,
  singleQuote: true,
  semi: false,
  tabWidth: 2,
  plugins: [fileURLToPath(import.meta.resolve('prettier-plugin-svelte'))],
  overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
}
