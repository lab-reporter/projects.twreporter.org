<script lang="ts">
  import type { Snippet } from 'svelte'

  const { children }: { children: Snippet } = $props()
</script>

<h1>
  {@render children()}
</h1>

<style>
  h1 {
    font-size: var(--text-l);
    font-weight: 700;
    line-height: 1.2;
    font-family: 'Noto Serif TC';
  }
</style>
