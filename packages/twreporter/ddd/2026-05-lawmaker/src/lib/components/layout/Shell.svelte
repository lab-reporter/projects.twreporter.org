<script lang="ts">
    import { domToPng } from "modern-screenshot";
    import type { Snippet } from "svelte";
    import Background from "../icons/Background.svelte";
    import DoubleBackground from "../icons/DoubleBackground.svelte";
    import Background2 from "../icons/Background-2.svelte";

    let container: HTMLDivElement | null = $state(null);

    // 使用 `?download` 檢查是否要開啟下載選項
    const urlParams = new URLSearchParams(window.location.search);
    const showDownload = urlParams.has("download");

    const {
        name,
        children,
        headerChildren,
        backgroundStyle = "default",
        raw = false,
    }: {
        name: string;
        description?: string;
        footnotes?: string[];
        children: Snippet;
        headerChildren?: Snippet;
        backgroundStyle?: "default" | "alternative" | "double";
        raw?: boolean;
    } = $props();
</script>

<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/tailwindcss-preflight@1.0.1/preflight.min.css"
    crossorigin="anonymous"
/>

{#if raw}
    <div>
        {@render children()}
    </div>
{:else}
    <div class="outer">
        <div
            class="container"
            bind:this={container}
            class:double={backgroundStyle === "double"}
        >
            {#if backgroundStyle === "default"}
                <Background />
            {:else if backgroundStyle === "alternative"}
                <Background2 />
            {:else if backgroundStyle === "double"}
                <DoubleBackground />
            {/if}

            <div class="header">
                <h1>{name}</h1>
                {@render headerChildren?.()}
            </div>

            {@render children()}
        </div>

        {#if showDownload}
            <div class="download-control">
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
{/if}

<style>
    * {
        --tr-text: #404040;

        --background: transparent;
        --background-muted: rgba(255, 255, 255, 0.7);
        --track-background: #fff;
        --blue-primary: #006bff;
        --background-primary: var(--blue-primary);
        --pink-primary: #ff0088;
        --pink-muted: #efede9;
        --red-primary: #ff4713;
        --red-muted-500: #78756e;
        --red-muted: #cfc8ba;
        --box-background: #ffffff;
        --box-background-20: #ffffff14; /* 20% */
        --box-background-50: #ffffff32; /* 50% */
        --black-900: #262626;
        --black-800: #42464c;
        --black-700: #54524d;

        --text-color: var(--black-700);
        --primary-color: var(--red-primary);
        --background-color: var(--pink-muted);
        --note-bar-color: var(--red-muted);
        --swing-color: var(--blue-primary);
        --outline-color: var(--red-muted-500);

        --rounded-full: 100vw;
        --inner-shadow: -2px -2px 4px 0 rgba(0, 0, 0, 0.25) inset;
        --inner-shadow-heavy: -2px -2px 4px 0 rgba(0, 0, 0, 0.5) inset;

        color: var(--black-700);
        font-family: var(--font, "GenJyuuGothicL"), sans-serif;
        text-align: left !important;
    }

    .outer {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 60px 0;
    }

    .container {
        max-width: 730px;
        width: 100%;
        position: relative;
        padding: 5px 20px 50px 20px;
        background: var(--background);
        border-radius: 3px;
        --btn-size: 9px;
    }

    .container.double {
        padding-bottom: 20px;
    }

    @media (max-width: 550px) {
        .container {
            padding-bottom: 10px;
        }
    }

    .header {
        padding: 5px 0 0;
        margin-bottom: 30px;
        display: flex;
        align-items: end;
        justify-content: space-between;
    }

    .header h1 {
        white-space: pre-wrap;
        font-size: 36px;
        font-weight: 900;
    }

    @media (max-width: 550px) {
        .header {
            flex-direction: column;
            gap: 15px;
            align-items: start;
            margin-bottom: 20px;
        }

        .header h1 {
            font-size: 24px;
        }
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
