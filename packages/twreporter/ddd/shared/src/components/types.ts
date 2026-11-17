import type { Snippet } from 'svelte'

export type ComponentProps = {
  src: string
  config: string
}

export type ComponentPropsWithChildren = ComponentProps & {
  children: Snippet
}
