<script lang="ts">
    type Layer = { legend?: string; name: string; src: string };
    type Base = { src: string; opacity?: string };
    type Legend = { src: string; name: string };
    type ViewMode = "default" | "showAll" | "single";

    let {
        bases,
        layers,
        legends,
    }: { bases: Base[]; layers: Layer[]; legends?: Legend[] } = $props();

    let viewMode = $state<ViewMode>("default");
    let activeLayerName = $state<string | null>(null);
    let disabledLayers = $state(new Set<string>());

    let hoverLocked = $derived(viewMode !== "single");
    let showAllBaseImages = $derived(viewMode === "showAll");

    const isLayerVisible = (name: string): boolean => {
        if (viewMode === "single") {
            return name === activeLayerName;
        }
        return true; // 'default' and 'showAll' show all layers
    };

    const isLayerDisabled = (name: string): boolean => {
        return disabledLayers.has(name);
    };

    // Actions
    const selectSingleLayer = (name: string) => {
        viewMode = "single";
        activeLayerName = name;
    };

    const resetToDefault = () => {
        viewMode = "default";
        activeLayerName = null;
    };

    const toggleShowAll = () => {
        if (viewMode === "showAll") {
            resetToDefault();
        } else {
            viewMode = "showAll";
            activeLayerName = null;
        }
    };

    const handleLayerClick = (name: string) => {
        if (viewMode === "single" && activeLayerName === name) {
            // Clicking active layer in single mode -> back to default
            resetToDefault();
        } else {
            selectSingleLayer(name);
        }
    };

    const handleLayerHover = (e: PointerEvent, name: string) => {
        // Because mobile devices trigger mouseEnter and click event at the same time,
        // only respond to pointer mouse hover, not touch events.
        if (!hoverLocked && e.pointerType === "mouse") {
            selectSingleLayer(name);
        }
    };

    const markLayerDisabled = (name: string) => {
        disabledLayers = new Set([...disabledLayers, name]);
    };
</script>

<div class="controls">
    <button
        class:active={viewMode === "showAll"}
        class:all={viewMode === "showAll"}
        onclick={toggleShowAll}
        class="full"
    >
        顯示所有事故
    </button>
    <div class="indv">
        {#each layers as layer (layer.name)}
            {@const disabled = isLayerDisabled(layer.name)}
            {@const visible = isLayerVisible(layer.name)}
            {@const allVisible = viewMode !== "single"}
            <button
                title={layer.name}
                class:active={visible && !disabled}
                class:all={allVisible && !disabled}
                class:stripe={disabled}
                onclick={() => handleLayerClick(layer.name)}
                onpointerenter={(e) => handleLayerHover(e, layer.name)}
                {disabled}
            >
                {#if layer.legend}
                    <img src={layer.legend} alt={layer.name} class="legend" />
                {/if}
                {layer.name}
            </button>
        {/each}
    </div>
</div>
<div class="images">
    <img src={bases[0].src} alt={bases[0].src} style:opacity="0" />
    <div class="layers">
        {#each bases as base (base.src)}
            <img
                src={base.src}
                alt={base.src}
                style:opacity={showAllBaseImages ? "1" : (base.opacity ?? "1")}
                onerror={function () {
                    this.style = "display:none";
                }}
            />
        {/each}
        {#each [...layers].reverse() as layer (layer.name)}
            {@const visible = isLayerVisible(layer.name)}
            <img
                src={layer.src}
                alt={layer.name}
                class:show={visible}
                onerror={function () {
                    this.style = "display:none";
                    markLayerDisabled(layer.name);
                }}
            />
        {/each}
        {#if legends}
            <div class="legends">
                {#each legends as legend}
                    <div class="floating-legend">
                        <img src={legend.src} alt={legend.name} />
                        <p>{legend.name}</p>
                    </div>
                {/each}
            </div>
        {/if}
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

    .layers > img {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
    }

    .layers .legends {
        position: absolute;
        right: 0;
        bottom: 0;
        padding: 10px 10px;
        margin: 20px 20px;
        backdrop-filter: blur(5px);
        background-color: #f1f1f1;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .floating-legend {
        display: flex;
        gap: 5px;
        height: var(--btn-size);
        align-items: center;
    }

    .floating-legend img {
        width: var(--btn-size);
    }

    .floating-legend p {
        font-size: var(--btn-size);
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
        cursor: not-allowed;
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
