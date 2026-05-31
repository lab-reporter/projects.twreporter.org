<script lang="ts">
  import type { Snippet } from 'svelte'

  const {
    children,
    variant,
  }: { children?: Snippet; variant?: 'top' | 'left' } = $props()
</script>

<div class={['panel', variant]}>
  {@render children?.()}
</div>

<style>
  .panel {
    width: 100%;
    height: 100%;
    background-color: var(--neutral-gray-50);
    border-radius: 10px;
  }

  .panel.top {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-top-width: 0;
    border-right-width: 0;
    padding: 25px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .panel.top > :global(div) {
    display: flex;
    gap: 10px;
  }

  .panel.left {
    display: flex;
    min-height: 0;
    flex-direction: column;
    overflow: hidden;
    border-top-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    border-left-width: 0;
    border-bottom-width: 0;
    padding: 15px;
  }
</style>
