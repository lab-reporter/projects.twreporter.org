<script lang="ts">
    type Layer = { legend?: string; name: string; src: string };
    type Base = { src: string; opacity?: string };
    type LayerState = Layer & { show: boolean; disabled: boolean };

    let { bases, layers: inputLayers }: { bases: Base[]; layers: Layer[] } =
        $props();

    let layers = $state(
        inputLayers.map((l) => ({ ...l, show: true, disabled: false })),
    );

    let hoverLocked = $state(true);
    let showingSingleImage = $derived(
        layers.filter((l) => l.show).length === 1,
    );
    let showAllBaseImages = $state(false);
    const toggleBaseImages = () => {
        if (showAllBaseImages == false) {
            hoverLocked = true;
            showAllBaseImages = true;
        } else {
            showAllBaseImages = false;
        }
    };

    const updateLayer = (
        name: string,
        updatedLayer: LayerState,
        toggleOthers = true,
    ) => {
        layers = layers?.map((layer) =>
            layer.name === name
                ? updatedLayer
                : { ...layer, show: toggleOthers ? false : layer.show },
        );
    };

    const activateLayer = (name: string) => {
        layers = layers.map((layer) =>
            layer.name === name
                ? { ...layer, show: true }
                : { ...layer, show: false },
        );
        hoverLocked = false;
        showAllBaseImages = false;
    };

    const activateAllLayers = () => {
        layers = layers?.map((layer) => ({
            ...layer,
            show: true,
        }));
    };
</script>

<div class="controls">
    {#if layers}
        <button
            class:active={showAllBaseImages}
            class:all={showAllBaseImages}
            onclick={() => {
                toggleBaseImages();
                activateAllLayers();
            }}
            class="full"
        >
            顯示所有事故
        </button>
        <div class="indv">
            {#each layers as layer}
                <button
                    title={layer.name}
                    class:active={layer.show && !layer.disabled}
                    class:all={layers.every((layer) => layer.show) &&
                        !layer.disabled}
                    class:stripe={layer.disabled}
                    onclick={() => {
                        if (layer.show && showingSingleImage) {
                            activateAllLayers();
                            hoverLocked = true;
                        } else {
                            activateLayer(layer.name);
                        }
                    }}
                    onmouseenter={() => {
                        if (!hoverLocked) activateLayer(layer.name);
                    }}
                    disabled={layer.disabled}
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
                style:opacity={showAllBaseImages ? "1" : (base.opacity ?? "1")}
                onerror={function () {
                    this.style = "display:none";
                }}
            />
        {/each}
        {#each [...layers].reverse() as layer}
            <img
                src={layer.src}
                alt={layer.name}
                class:show={layer.show}
                onerror={function () {
                    this.style = "display:none";
                    updateLayer(
                        layer.name,
                        {
                            ...layer,
                            disabled: true,
                        },
                        false,
                    );
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
        opacity: 0.2;
        letter-spacing: 0.7px;
    }

    button.stripe {
        background: repeating-linear-gradient(
            -45deg,
            #c5c5c5,
            #c5c5c5 4px,
            #ffffff 4px,
            #ffffff 8px
        );
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
