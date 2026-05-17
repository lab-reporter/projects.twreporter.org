<script lang="ts">
  import type { Snippet } from 'svelte'

  const { children }: { children: Snippet } = $props()
</script>

<div>
  {@render children()}
</div>

<style>
  div {
    padding: 2px 7px;
    display: flex;
    gap: 7px;
    align-items: center;
    justify-content: start;
    background-color: var(--neutral-offwhite);
    border-radius: 4px;
  }
</style>
