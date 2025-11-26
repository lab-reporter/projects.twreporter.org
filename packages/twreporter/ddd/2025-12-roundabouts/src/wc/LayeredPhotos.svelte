<script lang="ts">
  type Layer = { legend?: string; name: string; src: string }
  type LayerState = Layer & { show: boolean }

  let {
    name,
    base,
    layers,
    footnotes,
  }: { name: string; base: string; layers: Layer[]; footnotes: string[] } =
    $props()

  let layerState = $state(layers.map((l, index) => ({ ...l, show: true })))

  let lockedState = $state(true)

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
  <div class="header"><h1>{name}</h1></div>
  <div class="controls">
    <button
      class:active={layerState.every((layer) => layer.show)}
      onclick={() => {
        lockedState = true
        layerState = layerState.map((layer) => ({ ...layer, show: true }))
      }}
    >
      顯示所有事故
    </button>
    <div class="indv">
      {#each layerState as layer}
        <button
          title={layer.name}
          class:active={layer.show}
          onclick={() => {
            activateLayer(layer)
            lockedState = false
          }}
          onmouseenter={() => {
            if (!lockedState) activateLayer(layer)
          }}
        >
          {#if layer.legend}
            <img src={layer.legend} alt={layer.name} class="legend" />
          {/if}
          {layer.name}</button
        >
      {/each}
    </div>
  </div>
  <div class="images">
    <img src={base} alt={name} />
    <div class="layers">
      {#each layerState as layer}
        <img src={layer.src} alt={layer.name} class:show={layer.show} />
      {/each}
    </div>
    <div class="footer">
      <div class="footnotes">
        {#each footnotes as footnote}
          <p>{footnote}</p>
        {/each}
      </div>
      <img
        src="https://projects.twreporter.org/twreporter/ddd/2025-0823-vote/assets/logo-black.png"
        class="logo"
        alt="報導者 The Reporter"
      />
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
    padding: 0 10px;
    background: #f1f1f1;
    --btn-size: 10px;
  }

  .header {
    padding: 10px 0;
  }

  .header h1 {
    font-size: 24px;
    font-weight: bold;
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

  .controls {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
  }

  .controls .indv {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .controls button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 0;
    background: white;
    border-radius: 5px 5px 0 0;
    font-size: var(--btn-size);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    opacity: 0.5;
  }

  @media (min-width: 500px) {
    .container {
      --btn-size: 14px;
    }
  }

  .controls .active {
    opacity: 1;
  }

  .controls .legend {
    width: var(--btn-size);
    aspect-ratio: 1/1;
    margin-right: 5px;
  }

  .footer {
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    --footer-scale: 1;
  }

  .footer p {
    color: #acacac;
    font-size: calc(10px * var(--footer-scale));
  }

  @media (min-width: 500px) {
    .footer {
      --footer-scale: 1.25;
    }
  }

  .footer .logo {
    width: calc(14.5px * var(--footer-scale));
    height: calc(15.5px * var(--footer-scale));
  }
</style>
