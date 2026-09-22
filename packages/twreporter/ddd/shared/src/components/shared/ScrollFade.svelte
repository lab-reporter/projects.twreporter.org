<script lang="ts">
  import type { Snippet } from 'svelte'

  const { children }: { children: Snippet } = $props()
  let viewport: HTMLDivElement | undefined = $state()
  let canScrollRight = $state(false)

  function updateFade() {
    if (!viewport) return
    canScrollRight =
      viewport.scrollWidth - viewport.clientWidth - viewport.scrollLeft > 1
  }

  $effect(() => {
    if (!viewport) return
    const observer = new ResizeObserver(updateFade)
    observer.observe(viewport)
    for (const child of viewport.children) observer.observe(child)
    return () => observer.disconnect()
  })
</script>

<div class="scroll-container">
  <div class="viewport" bind:this={viewport} onscroll={updateFade}>
    {@render children()}
  </div>
  <div class="fade" class:visible={canScrollRight} aria-hidden="true"></div>
</div>

<style>
  .scroll-container {
    position: relative;
    min-width: 0;
    width: 100%;
  }

  .viewport {
    overflow-x: auto;
    scrollbar-width: none;
  }

  .viewport::-webkit-scrollbar {
    display: none;
  }

  .fade {
    position: absolute;
    top: 0;
    right: -1px;
    bottom: 0;
    width: 40px;
    background: linear-gradient(to left, var(--neutral-gray-50), transparent);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .fade.visible {
    opacity: 1;
  }
</style>
