<!-- svelte-ignore custom_element_props_identifier -->
<svelte:options customElement={{ tag: "twreporter-layered-photos" }} />

<script lang="ts">
    import { domToPng } from "modern-screenshot";
    let container: HTMLDivElement | null = null;

    // 使用 `?download` 檢查是否要開啟下載選項
    const urlParams = new URLSearchParams(window.location.search);
    const showDownload = urlParams.has("download");

    import LayeredPhotos from "./LayeredPhotos.svelte";

    let {
        name,
        footnotes: inputFootnotes,
        ...props // We use non-destructured props to support dynamic props with group ids in them.
    }: { name: string; footnotes: string } & (
        | { base: string; layers: string; legends?: string }
        | {
              groups: string;
              [x: `base-${string}`]: string;
              [x: `layers-${string}`]: string;
              [x: `legends-${string}`]: string;
          }
    ) = $props();

    const footnotes = inputFootnotes.split(",").map((f) => f.trim());

    const groups =
        "groups" in props
            ? props.groups.split(",").map((g) => {
                  const [id, name] = g.trim().split(" ");
                  return { id, name };
              })
            : undefined;

    let activeGroupId = $state(groups?.[0].id);
</script>

<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/tailwindcss-preflight@1.0.1/preflight.min.css"
    crossorigin="anonymous"
/>

<div class="outer">
    <div class="container" bind:this={container}>
        <div class="header"><h1>{name}</h1></div>

        {#if "groups" in props}
            {#each groups as group}
                <!-- Use `hidden` to control group's visibility so that all elements are still rendered on load, preventing layout shift when switching groups -->
                <div hidden={activeGroupId !== group.id}>
                    <LayeredPhotos
                        bases={props[`base-${group.id}`]
                            .split(",")
                            .map((base) => {
                                const [src, opacity] = base.trim().split(" ");
                                return { src, opacity };
                            })}
                        layers={props[`layers-${group.id}`]
                            .split(",")
                            .map((layer) => {
                                const [name, src, legend] = layer
                                    .trim()
                                    .split(" ");
                                return { name, src, legend };
                            })}
                        legends={props[`legends-${group.id}`]
                            ?.split(",")
                            .map((base) => {
                                const [name, src] = base.trim().split(" ");
                                return { src, name };
                            })}
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
                bases={props.base.split(",").map((base) => {
                    const [src, opacity] = base.trim().split(" ");
                    return { src, opacity };
                })}
                layers={props.layers.split(",").map((layer) => {
                    const [name, src, legend] = layer.trim().split(" ");
                    return { name, src, legend };
                })}
                legends={props.legends?.split(",").map((base) => {
                    const [name, src] = base.trim().split(" ");
                    return { src, name };
                })}
            />
        {/if}

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
        color: var(--tr-text);
        font-family: "Roboto Slab", "Noto Sans TC", sans-serif;
        text-align: left !important;
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

    .footer {
        padding: 10px 0 10px 0;
        display: flex;
        align-items: end;
        justify-content: space-between;
        --footer-scale: 1;
        --footer-logo-scale: 1.25;
    }

    @media (min-width: 500px) {
        .footer {
            padding: 15px 0 10px 0;
            --footer-scale: 1.6;
            --footer-logo-scale: 2;
        }
    }

    .footnotes {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    @media (min-width: 500px) {
        .footnotes {
            gap: 5px;
        }
    }

    .footer p {
        color: #acacac;
        font-size: calc(10px * var(--footer-scale));
    }

    .footer .logo {
        width: calc(14.5px * var(--footer-logo-scale));
        height: calc(15.5px * var(--footer-logo-scale));
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
