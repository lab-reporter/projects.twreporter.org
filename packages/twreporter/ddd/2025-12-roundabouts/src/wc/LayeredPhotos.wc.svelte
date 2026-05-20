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
    import Legends from "../lib/components/Legends.svelte";
    import Table from "../lib/components/Table.svelte";

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
            "table-name"?: string;
            "table-value"?: string;
        } = $props();

    const splitCsv = (input = "", delimiter = ",") =>
        input
            .split(delimiter)
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
    const tableName = props["table-name"];
    const table = splitCsv(props["table-value"]).map((row) =>
        splitCsv(row, " "),
    );
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
                    <Table name={tableName} {table} />

                    <div class="bar-chart">
                        <Legends
                            legends={barchartY.map((name, index) => {
                                return {
                                    name,
                                    color: barchartColors[index],
                                };
                            })}
                        />
                        <BarChart
                            xKeys={barchartX}
                            yKeys={barchartY}
                            values={barchartValues}
                            colors={barchartColors}
                        />
                    </div>

                    <Footer
                        {footnotes}
                        --footer-scale="1.2"
                        --footer-logo-scale="1.5"
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
        /* 報導者 Library */
        --brand-faded: rgba(244, 198, 198, 1);
        --brand-pastel: rgba(247, 105, 119, 1);
        --brand-main: rgba(248, 11, 40, 1);
        --brand-heavy: rgba(196, 13, 35, 1);
        --brand-dark: rgba(155, 5, 30, 1);
        --neutral-white: rgba(255, 255, 255, 1);
        --neutral-gray-50: rgba(250, 250, 250, 1);
        --neutral-gray-100: rgba(241, 241, 241, 1);
        --neutral-gray-200: rgba(226, 226, 226, 1);
        --neutral-gray-300: rgba(205, 205, 205, 1);
        --neutral-gray-400: rgba(187, 187, 187, 1);
        --neutral-gray-500: rgba(156, 156, 156, 1);
        --neutral-gray-600: rgba(128, 128, 128, 1);
        --neutral-gray-700: rgba(102, 102, 102, 1);
        --neutral-gray-800: rgba(64, 64, 64, 1);
        --neutral-gray-900: rgba(38, 38, 38, 1);
        --neutral-black: rgba(0, 0, 0, 1);
        --supportive-faded: rgba(240, 213, 190, 1);
        --supportive-pastel: rgba(227, 190, 152, 1);
        --supportive-main: rgba(192, 150, 98, 1);
        --supportive-heavy: rgba(159, 117, 68, 1);
        --supportive-dark: rgba(122, 82, 44, 1);
        --podcast-faded: rgba(196, 242, 220, 1);
        --podcast-pastel: rgba(153, 236, 201, 1);
        --podcast-main: rgba(110, 229, 181, 1);
        --podcast-heavy: rgba(60, 146, 122, 1);
        --podcast-dark: rgba(14, 53, 50, 1);
        --photography-faded: rgba(171, 222, 244, 1);
        --photography-pastel: rgba(109, 155, 224, 1);
        --photography-main: rgba(47, 88, 204, 1);
        --photography-heavy: rgba(20, 48, 113, 1);
        --photography-dark: rgba(5, 33, 66, 1);
        --kids-red: rgba(255, 93, 116, 1);
        --kids-yellow: rgba(255, 189, 0, 1);
        --kids-blue: rgba(39, 179, 245, 1);

        /* 專題圖表製作 */
        --chart-earth-1: rgba(241, 231, 223, 1);
        --chart-earth-2: rgba(240, 213, 190, 1);
        --chart-earth-3: rgba(212, 169, 110, 1);
        --chart-earth-4: rgba(156, 117, 70, 1);
        --chart-earth-5: rgba(123, 83, 45, 1);
        --chart-patina-1: rgba(222, 231, 222, 1);
        --chart-patina-2: rgba(199, 209, 199, 1);
        --chart-patina-3: rgba(142, 161, 151, 1);
        --chart-patina-4: rgba(93, 111, 110, 1);
        --chart-patina-5: rgba(66, 79, 79, 1);
        --chart-mint-1: rgba(213, 231, 222, 1);
        --chart-mint-2: rgba(172, 208, 198, 1);
        --chart-mint-3: rgba(108, 161, 152, 1);
        --chart-mint-4: rgba(80, 110, 105, 1);
        --chart-mint-5: rgba(48, 74, 71, 1);
        --chart-purple-1: rgba(235, 221, 240, 1);
        --chart-purple-2: rgba(208, 182, 217, 1);
        --chart-purple-3: rgba(162, 125, 180, 1);
        --chart-purple-4: rgba(119, 81, 138, 1);
        --chart-purple-5: rgba(97, 71, 102, 1);
        --chart-olive-1: rgba(231, 233, 208, 1);
        --chart-olive-2: rgba(215, 217, 154, 1);
        --chart-olive-3: rgba(178, 181, 99, 1);
        --chart-olive-4: rgba(121, 125, 69, 1);
        --chart-olive-5: rgba(94, 94, 54, 1);
        --chart-indigo-1: rgba(223, 223, 241, 1);
        --chart-indigo-2: rgba(201, 201, 237, 1);
        --chart-indigo-3: rgba(140, 141, 212, 1);
        --chart-indigo-4: rgba(102, 100, 170, 1);
        --chart-indigo-5: rgba(70, 62, 114, 1);
        --chart-red-1: rgba(245, 224, 225, 1);
        --chart-red-2: rgba(245, 191, 196, 1);
        --chart-red-3: rgba(226, 126, 133, 1);
        --chart-red-4: rgba(161, 83, 84, 1);
        --chart-red-5: rgba(105, 57, 60, 1);
        --chart-blue-1: rgba(218, 230, 237, 1);
        --chart-blue-2: rgba(190, 212, 234, 1);
        --chart-blue-3: rgba(135, 169, 212, 1);
        --chart-blue-4: rgba(81, 115, 153, 1);
        --chart-blue-5: rgba(56, 74, 98, 1);
        --chart-gray-1: rgba(232, 227, 227, 1);
        --chart-gray-2: rgba(209, 205, 205, 1);
        --chart-gray-3: rgba(170, 165, 165, 1);
        --chart-gray-4: rgba(107, 104, 104, 1);
        --chart-gray-5: rgba(70, 66, 66, 1);
    }

    * {
        --text-xs: 14px;
        --text-s: 16px;
        --text-m: 18px;
        --text-l: 24px;
        --text-xl: 28px;
        --text-xl-leading: 1.3;

        @media (max-width: 480px) {
            --text-xs: 10px;
            --text-s: 12px;
            --text-m: 16px;
            --text-l: 18px;
            --text-xl: 22px;
        }
    }

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
        --btn-size: 12px;
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
        display: flex;
        flex-direction: column;
        gap: 15px;
        width: 100%;
        min-height: 0;
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

    .bar-chart {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>
