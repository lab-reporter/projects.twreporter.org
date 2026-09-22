import type { Preview } from '@storybook/svelte-vite'
import { z } from 'zod'

const query = new URLSearchParams(window.location.search)

const preview = {
  // Storybook rejects URLs in args. Resolve the `url` token through its
  // built-in mapping, using ordinary query parameters for the actual URLs.
  argTypes: Object.fromEntries(
    ['src', 'config'].flatMap((field) => {
      const result = z.url({ protocol: /^https?$/ }).safeParse(query.get(field))
      return result.success ? [[field, { mapping: { url: result.data } }]] : []
    }),
  ),
} satisfies Preview

export default preview
