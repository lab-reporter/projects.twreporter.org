<script lang="ts">
  import { onMount } from 'svelte'
  import { SogScene } from './sog.svelte.ts'
  import type { ViewportView } from './viewport.svelte.ts'

  const { url, view }: { url: string; view: ViewportView } = $props()
  const scene = new SogScene()
  let canvas: HTMLCanvasElement
  onMount(() => scene.mount(canvas, url))
  $effect(() => scene.setView(view))
</script>

<canvas bind:this={canvas} aria-label="Overhead streamed SOG scene"></canvas>
{#if scene.error}<p class="status error" role="alert">{scene.error}</p>
{:else if scene.loading}<p class="status" role="status">
    Loading SOG detail…
  </p>{/if}

<style>
  canvas {
    display: block;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .status {
    position: absolute;
    left: 12px;
    bottom: 12px;
    z-index: 1;
    max-width: calc(100% - 160px);
    margin: 0;
    padding: 8px;
    color: white;
    background: #182126dd;
    pointer-events: none;
  }
  .error {
    color: #ffd1d1;
  }
</style>
