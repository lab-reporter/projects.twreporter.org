<script lang="ts">
  import { ScrollerBase } from '@reuters-graphics/graphics-components'
  import CardContent from './components/CardContent.svelte'
  import Loading from './components/Loading.svelte'
  import { CardState } from './lib/card.svelte'
  import { useCesium } from './lib/runes/cesium.svelte'

  let { containerId, docId }: { containerId: string; docId?: string } = $props()

  let mapElement: HTMLDivElement | undefined = $state()

  const cesium = useCesium({
    getContainer: () => mapElement,
    docId,
  })
  let viewer = $derived(cesium.viewer)
  let contentQuery = $derived(cesium.query)

  let content = $derived(contentQuery?.data)
  const cardState = new CardState({
    getViewer: () => viewer,
    getContent: () => content,
  })

  // Inspect content from ArchieML in development
  $inspect(content)
</script>

{#if cardState.hasCards}
  <ScrollerBase
    top={0}
    threshold={0.33}
    bottom={1}
    bind:index={cardState.activeIndex}
    query="div.step"
  >
    {#snippet backgroundSnippet()}
      <div class="background">
        {#if contentQuery.isLoading}
          <div class="loading-screen"><Loading /></div>
        {/if}
        <div bind:this={mapElement} id={containerId} class="map"></div>
      </div>
    {/snippet}

    {#snippet foregroundSnippet()}
      {#each cardState.cards as card}
        <div class="step">
          <CardContent {card} />
        </div>
      {/each}
    {/snippet}
  </ScrollerBase>
{:else}
  <div class="background">
    {#if contentQuery.isLoading}
      <div class="loading-screen"><Loading /></div>
    {/if}
  </div>
{/if}

<style>
  :global(svelte-scroller-background-container) {
    pointer-events: auto !important;
    will-change: auto !important;
  }

  :global(svelte-scroller-foreground) {
    pointer-events: none;
  }

  .background {
    height: 100vh;
    width: 100%;
    position: relative;
  }

  .step {
    pointer-events: auto;
  }

  .map {
    height: 100%;
  }

  .loading-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    z-index: 10;
  }

  :global(.cesium-viewer) {
    height: 100%;
  }
</style>
