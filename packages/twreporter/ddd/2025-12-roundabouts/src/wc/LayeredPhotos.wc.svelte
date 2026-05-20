<!-- svelte-ignore custom_element_props_identifier -->
<svelte:options customElement={{ tag: "twreporter-layered-photos" }} />

<script lang="ts">
    import { domToPng } from "modern-screenshot";
    let container: HTMLDivElement | null = null;

    // 使用 `?download` 檢查是否要開啟下載選項
    const urlParams = new URLSearchParams(window.location.search);
    const showDownload = urlParams.has("download");

    import { assets } from "../lib/constants/assets";
    import BarChart from "./BarChart.svelte";
    import LayeredPhotos from "./LayeredPhotos.svelte";
    import Footer from "../lib/components/Footer.svelte";

    type Group = { id: string; name: string };
    type ParsedBase = { src: string; opacity?: string };
    type ParsedLayer = { name: string; src: string; legend?: string };
    type ParsedLegend = { src: string; name: string };

    let {
        name,
        footnotes: inputFootnotes,
        layout,
        ...props // We use non-destructured props to support dynamic props with group ids in them.
    }: { name: string; footnotes: string; layout?: string } & (
        | { base: string; layers: string; legends?: string }
        | {
              groups: string;
              [x: `base-${string}`]: string;
              [x: `layers-${string}`]: string;
              [x: `legends-${string}`]: string;
          }
    ) & {
            "barchart-x"?: string;
            "barchart-y"?: string;
            "barchart-value"?: string;
            "barchart-y-color"?: string;
            "compass-rotation"?: string;
        } = $props();

    const splitCsv = (input = "") =>
        input
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

    const parseBases = (input = ""): ParsedBase[] =>
        splitCsv(input).map((base) => {
            const [src, opacity] = base.split(/\s+/);
            return { src, opacity };
        });

    const parseLayers = (input = ""): ParsedLayer[] =>
        splitCsv(input).map((layer) => {
            const [name, src, legend] = layer.split(/\s+/);
            return { name, src, legend };
        });

    const parseLegends = (input = ""): ParsedLegend[] =>
        splitCsv(input).map((base) => {
            const [name, src] = base.split(/\s+/);
            return { src, name };
        });

    const getDynamicProp = (key: string) =>
        (props as Record<string, string | undefined>)[key];

    const footnotes = splitCsv(inputFootnotes);
    const isVerticalWithBarchart = layout === "vertical-with-barchart";

    const groups: Group[] | undefined =
        "groups" in props
            ? splitCsv(props.groups).map((g) => {
                  const [id, name] = g.split(/\s+/);
                  return { id, name };
              })
            : undefined;

    let activeGroupId = $state(groups?.[0].id);

    const barchartX = splitCsv(props["barchart-x"]);
    const barchartY = splitCsv(props["barchart-y"]);
    const barchartValues = splitCsv(props["barchart-value"]).map((row) =>
        row
            .split(/\s+/)
            .map(Number)
            .filter((value) => Number.isFinite(value)),
    );
    const barchartColors = splitCsv(props["barchart-y-color"]);
    const compassRotation = Number(props["compass-rotation"] ?? 0) || 0;
</script>

<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/tailwindcss-preflight@1.0.1/preflight.min.css"
    crossorigin="anonymous"
/>

<div class="outer" class:vertical-with-barchart={isVerticalWithBarchart}>
    <div class="container" bind:this={container}>
        <div class="header"><h1>{name}</h1></div>

        {#if isVerticalWithBarchart && groups}
            <div class="controls bridge-tabs">
                {#each groups as group}
                    <button
                        onclick={() => (activeGroupId = group.id)}
                        class:active={activeGroupId === group.id}
                        >{group.name}</button
                    >
                {/each}
            </div>

            <div class="vertical-graphs">
                <div class="map-section">
                    {#each groups as group}
                        <!-- Use `hidden` to control group's visibility so that all elements are still rendered on load, preventing layout shift when switching groups -->
                        <div hidden={activeGroupId !== group.id}>
                            <LayeredPhotos
                                bases={parseBases(
                                    getDynamicProp(`base-${group.id}`),
                                )}
                                layers={parseLayers(
                                    getDynamicProp(`layers-${group.id}`),
                                )}
                                legends={parseLegends(
                                    getDynamicProp(`legends-${group.id}`),
                                )}
                                vertical
                            />
                        </div>
                    {/each}
                    <img
                        src={assets.compass}
                        class="compass"
                        style={`--compass-rotation: ${compassRotation}deg`}
                        alt="指北針"
                    />
                </div>
                <div class="chart-section">
                    <BarChart
                        xKeys={barchartX}
                        yKeys={barchartY}
                        values={barchartValues}
                        colors={barchartColors}
                    />
                    <Footer
                        {footnotes}
                        --footer-scale="1"
                        --footer-logo-scale="1.7"
                    />
                </div>
            </div>
        {:else if "groups" in props}
            {#each groups as group}
                <!-- Use `hidden` to control group's visibility so that all elements are still rendered on load, preventing layout shift when switching groups -->
                <div hidden={activeGroupId !== group.id}>
                    <LayeredPhotos
                        bases={parseBases(getDynamicProp(`base-${group.id}`))}
                        layers={parseLayers(
                            getDynamicProp(`layers-${group.id}`),
                        )}
                        legends={parseLegends(
                            getDynamicProp(`legends-${group.id}`),
                        )}
                    />
                </div>
            {/each}

            <div class="controls">
                {#each groups as group}
                    <button
                        onclick={() => (activeGroupId = group.id)}
                        class:active={activeGroupId === group.id}
                        >{group.name}</button
                    >
                {/each}
            </div>
        {:else}
            <LayeredPhotos
                bases={parseBases(props.base)}
                layers={parseLayers(props.layers)}
                legends={parseLegends(props.legends)}
            />
        {/if}

        {#if !isVerticalWithBarchart}
            <Footer {footnotes} />
        {/if}
    </div>

    {#if showDownload}
        <div class="download-control">
            <p>
                視窗寬度：{innerWidth}px（下載前請拉寬到超過730px）
            </p>
            <button
                class="dl-button"
                onclick={() =>
                    container &&
                    domToPng(container, {
                        quality: 1,
                        scale: 3,
                    }).then((dataUrl) => {
                        const a = document.createElement("a");
                        a.href = dataUrl;
                        a.download = `${name ?? "圖表"}／報導者.png`;
                        a.click();
                    })}>下載 PNG</button
            >
        </div>
    {/if}
</div>

<style>
    * {
        --tr-text: #404040;
        --footer-scale: 1;
        --footer-logo-scale: 1.25;
        color: var(--tr-text);
        font-family: "Roboto Slab", "Noto Sans TC", sans-serif;
        text-align: left !important;
    }

    @media (min-width: 500px) {
        * {
            --footer-scale: 1.6;
            --footer-logo-scale: 2;
        }
    }

    .outer {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .container {
        max-width: 600px;
        position: relative;
        padding: 8px 10px;
        background: #f1f1f1;
        --btn-size: 9px;
        border-top: #e2e2e2 1px solid;
        border-bottom: #e2e2e2 1px solid;
    }

    @media (min-width: 500px) {
        .container {
            padding: 10px 10px;
        }
    }

    .header {
        padding: 5px 0 0;
    }

    @media (min-width: 500px) {
        .header h1 {
            padding: 5px 0 15px;
        }
    }

    .header h1 {
        font-size: 24px;
        font-weight: bold;
        padding: 5px 0 10px;
    }

    @media (min-width: 500px) {
        .header h1 {
            font-size: 28px;
        }
    }

    @media (min-width: 500px) {
        .container {
            --btn-size: 14px;
        }
    }

    @media (min-width: 670px) {
        .container {
            --btn-size: 16px;
        }
    }

    .controls {
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
        border-radius: 0 0 5px 5px;
        font-size: var(--btn-size);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        opacity: 0.5;
        letter-spacing: 0.7px;
    }

    @media (max-width: 400px) {
        .controls button {
            padding: 8px 0;
        }
    }

    .controls .active {
        opacity: 1;
        font-weight: 600;
    }

    .bridge-tabs {
        gap: 6px;
        margin-bottom: 8px;
    }

    .controls.bridge-tabs button {
        border-radius: 5px;
    }

    .vertical-graphs {
        display: grid;
        grid-template-columns: minmax(0, 1.55fr) minmax(150px, 1fr);
        gap: 12px;
        align-items: stretch;
    }

    .map-section {
        position: relative;
        width: 100%;
        overflow: hidden;
    }

    .compass {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 6;
        width: clamp(32px, 10%, 42px);
        height: auto;
        transform: rotate(var(--compass-rotation));
        transform-origin: center;
    }

    .chart-section {
        display: grid;
        grid-template-rows: minmax(220px, 1fr) auto;
        gap: 12px;
        width: 100%;
        min-height: 0;
    }

    .vertical-with-barchart .footer {
    }

    .download-control {
        margin-top: 12px;
    }

    .dl-button {
        font-family: "Roboto Slab", "Noto Sans TC", sans-serif;
        padding: 5px 15px;
        background-color: #404040;
        color: white;
        border: none;
        border-radius: 40px;
        cursor: pointer;
        font-size: 12px;
        margin-top: 5px;
    }
</style>
