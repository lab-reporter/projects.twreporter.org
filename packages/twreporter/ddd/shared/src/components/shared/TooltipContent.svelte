<script lang="ts">
  import type { Snippet } from 'svelte'

  const {
    children,
    variant = 'dark',
  }: {
    children: Snippet
    variant?: 'dark' | 'light'
  } = $props()
</script>

<div class="content" class:light={variant === 'light'}>
  {@render children()}
</div>

<style>
  .content {
    box-sizing: border-box;
    max-height: inherit;
    overflow: auto;
    padding: 10px 12px;
    border-radius: 6px;
    background: var(--neutral-gray-900, #1a1a1a);
    color: var(--neutral-white, #fff);
    font-size: 13px;
    line-height: 1.6;
    box-shadow: 0 4px 14px
      color-mix(in srgb, var(--neutral-black, #000) 20%, transparent);
  }
  .content :global(*) {
    color: inherit;
    font-family: 'Roboto Slab', 'Noto Sans TC', sans-serif;
  }
  .light {
    border: 1px solid var(--neutral-gray-200, #ddd);
    padding: 0;
    background: #ffffffee;
    color: var(--neutral-gray-800, #333);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(8px);
  }
</style>
