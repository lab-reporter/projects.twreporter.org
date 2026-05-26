<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { SvelteHTMLElements } from 'svelte/elements'

  type Props = SvelteHTMLElements['div'] & {
    children?: Snippet
  }

  let { children, class: className, ...rest }: Props = $props()
</script>

<div class={['tabs-root', className]} {...rest}>
  {@render children?.()}
</div>

<style>
  .tabs-root {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    flex-direction: column;
    gap: 15px;
    overflow: hidden;
  }
</style>
