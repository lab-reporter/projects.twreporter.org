<script lang="ts">
  import { setCanvasContext } from '@/lib/components/canvas/CanvasState.svelte'
  import StyleWrapper from '@/lib/components/StyleWrapper.svelte'
  import { setTabsContext } from '@/lib/components/ui/tabs/TabsState.svelte'
  import type { Snippet } from 'svelte'

  const { children }: { children: Snippet } = $props()

  // Contexts
  setCanvasContext()
  setTabsContext()
</script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/tailwindcss-preflight@1.0.1/preflight.min.css"
  crossorigin="anonymous"
/>

<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
  rel="stylesheet"
/>

<StyleWrapper>
  <div class="layout">
    {@render children()}
  </div>
</StyleWrapper>

<style>
  .layout {
    width: 100vw;
    height: var(--height, 100dvh);
    overflow: var(--overflow, hidden);

    display: grid;
    grid-template-columns: 300px 1fr;
    grid-template-rows: 85px 1fr;

    background-color: var(--backgrouond-color);
    color: var(--text-color);
    font-family: 'Roboto Slab', 'Noto Sans TC', sans-serif;
  }
</style>
