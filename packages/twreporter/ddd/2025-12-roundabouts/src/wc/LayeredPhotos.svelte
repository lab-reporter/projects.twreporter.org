<script lang="ts">
    type Layer = { legend?: string; name: string; src: string };
    type Base = { src: string; opacity?: string };
    type LayerState = Layer & { show: boolean };

    let { bases, layers }: { bases: Base[]; layers: Layer[] } = $props();

    let layerState = $state(layers.map((l) => ({ ...l, show: true })));
    let reversedLayerState = $derived([...layerState].reverse());

    let lockedState = $state(true);
    let showAllLayers = $state(false);

    const updateLayer = (name: string, updatedLayer: LayerState) => {
        layerState = layerState?.map((layer) =>
            layer.name === name ? updatedLayer : { ...layer, show: false },
        );
    };

    const activateLayer = (layer: LayerState) => {
        updateLayer(layer.name, { ...layer, show: true });
    };
</script>

<div class="controls">
    {#if layerState}
        <button
            class:active={showAllLayers}
            class:all={showAllLayers}
            onclick={() => {
                if (showAllLayers == false) {
                    lockedState = true;
                    showAllLayers = true;
                } else {
                    showAllLayers = false;
                }
                layerState = layerState?.map((layer) => ({
                    ...layer,
                    show: true,
                }));
            }}
            class="full"
        >
            顯示所有事故
        </button>
        <div class="indv">
            {#each layerState as layer}
                <button
                    title={layer.name}
                    class:active={layer.show}
                    class:all={layerState.every((layer) => layer.show)}
                    onclick={() => {
                        activateLayer(layer);
                        lockedState = false;
                        showAllLayers = false;
                    }}
                    onmouseenter={() => {
                        if (!lockedState) activateLayer(layer);
                    }}
                >
                    {#if layer.legend}
                        <img
                            src={layer.legend}
                            alt={layer.name}
                            class="legend"
                        />
                    {/if}
                    {layer.name}</button
                >
            {/each}
        </div>
    {/if}
</div>
<div class="images">
    <img src={bases[0].src} alt={bases[0].src} style:opacity="0" />
    <div class="layers">
        {#each bases as base}
            <img
                src={base.src}
                alt={base.src}
                style:opacity={showAllLayers ? "1" : (base.opacity ?? "1")}
                onerror={function () {
                    this.style = "display:none";
                }}
            />
        {/each}
        {#each reversedLayerState as layer}
            <img
                src={layer.src}
                alt={layer.name}
                class:show={layer.show}
                onerror={function () {
                    this.style = "display:none";
                }}
            />
        {/each}
    </div>
</div>

<style>
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
        letter-spacing: 0.7px;
    }

    .controls .full {
        border-radius: 5px;
    }

    .controls .active {
        opacity: 1;
        font-weight: 600;
    }

    .controls .all {
        opacity: 1;
        font-weight: 400;
    }

    .controls .legend {
        width: var(--btn-size);
        margin-right: 5px;
    }
</style>
