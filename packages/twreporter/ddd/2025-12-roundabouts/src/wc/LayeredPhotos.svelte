<script lang="ts">
  type Layer = { legend?: string; name: string; src: string }
  type LayerState = Layer & { show: boolean }

  let { name, base, layers }: { name: string; base: string; layers: Layer[] } =
    $props()

  let layerState = $state(
    layers.map((l, index) => ({ ...l, show: index === 0 ? true : false }))
  )

  const updateLayer = (name: string, updatedLayer: LayerState) => {
    layerState = layerState.map((layer) =>
      layer.name === name ? updatedLayer : { ...layer, show: false }
    )
  }

  const activateLayer = (layer: LayerState) => {
    updateLayer(layer.name, { ...layer, show: true })
  }
</script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/tailwindcss-preflight@1.0.1/preflight.min.css"
  crossorigin="anonymous"
/>

<div class="container">
  <div class="controls">
    {#each layerState as layer}
      <button
        title={layer.name}
        class:active={layer.show}
        onmouseenter={() => activateLayer(layer)}
      >
        {#if layer.legend}
          <img src={layer.legend} alt={layer.name} class="legend" />
        {/if}
        {layer.name}</button
      >
    {/each}
  </div>
  <div class="images">
    <img src={base} alt={name} />
    <div class="layers">
      {#each layerState as layer}
        <img src={layer.src} alt={layer.name} class:show={layer.show} />
      {/each}
    </div>
    <div class="hover-overlay" aria-hidden="true">
      {#each layerState as layer}
        <div
          role="presentation"
          aria-hidden="true"
          onmouseenter={() => activateLayer(layer)}
        ></div>
      {/each}
    </div>
  </div>
</div>

<style>
  * {
    --tr-text: #404040;
    color: var(--tr-text);
    font-family: 'Roboto Slab', 'Noto Sans TC', sans-serif;
    text-align: left !important;
  }

  .container {
    max-width: 730px;
    position: relative;
  }

  .images {
    width: 100%;
    position: relative;
  }

  .layers {
    width: 100%;
  }

  .layers img {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }

  .layers .show {
    opacity: 1;
  }

  .hover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    pointer-events: none;
  }

  .hover-overlay div {
    pointer-events: auto;
  }

  @media (hover: hover) and (pointer: fine) {
    .hover-overlay {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    }
  }

  .controls {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
  }

  .controls button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 10px;
  }

  .controls .active {
    font-weight: bold;
  }

  .controls .legend {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
</style>
