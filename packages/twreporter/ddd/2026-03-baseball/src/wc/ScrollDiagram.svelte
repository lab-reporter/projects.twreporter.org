<script lang="ts">
    import { ScrollerBase } from "@reuters-graphics/graphics-components";
    import { untrack } from "svelte";
    import AudioProvider from "../lib/components/audio/AudioProvider.svelte";
    import Button from "../lib/components/Button.svelte";
    import AudioWave from "../lib/components/diagram/AudioWave.svelte";
    import PopupBackground from "../lib/components/icons/PopupBackground.svelte";
    import diagramData from "../lib/constants/diagram-bounds.generated.json";
    import {
        nodes,
        steps,
        type NodeMeta,
        type ScrollStep,
    } from "../lib/constants/scroll-diagram";
    import { MouseDrag } from "../lib/utils/mouse-drag.svelte";
    import { computeGroupView } from "../lib/utils/svg-nodes";
    import { getYouTubeEmbedUrl } from "../lib/utils/youtube-link";

    const CDN_BASE =
        "https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/assets";
    const MOBILE_BREAKPOINT = 768;

    const diagramBounds = diagramData.bounds;
    let innerWidth = $state(0);
    const isMobile = $derived(innerWidth <= MOBILE_BREAKPOINT);

    const scaleFactor = $derived(isMobile ? 0.5 : 1);
    const canvasWidth = $derived(diagramData.width * scaleFactor);
    const canvasHeight = $derived(diagramData.height * scaleFactor);
    const diagramSrc = $derived(
        isMobile
            ? `${CDN_BASE}/diagram-1.png?030615` // Mobile version exported at a different scale factor
            : `${CDN_BASE}/diagram.png?030615`,
    );

    let index = $state(0);
    let selectedNode: NodeMeta | null = $state(null);
    let viewportEl: HTMLDivElement | undefined = $state();

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const drag = new MouseDrag();

    // Hit targets: only nodes that exist in both diagramBounds and nodeMap
    const hitTargets = Object.entries(diagramBounds)
        .filter(([id]) => nodeMap.has(id))
        .map(([id, b]) => ({ id, ...b, meta: nodeMap.get(id)! }));

    $effect(() => {
        void steps[index];
        untrack(() => {
            drag.reset();
        });
    });

    const currentStep = $derived(steps[index] ?? steps[0]);

    const transform = $derived.by(() => {
        if (!viewportEl) return "translate(0px, 0px) scale(1)";

        const { cx, cy, scale } = resolveView(currentStep, viewportEl);
        const adjustedScale = scale / scaleFactor;
        const tx = viewportEl.clientWidth / 2 - cx * scale + drag.offset.x;
        const ty = viewportEl.clientHeight / 2 - cy * scale + drag.offset.y;
        return `translate(${tx}px, ${ty}px) scale(${adjustedScale})`;
    });

    const transition = $derived(
        drag.isDragging
            ? "none"
            : "transform 1000ms cubic-bezier(0.25, 0.1, 0.25, 1)",
    );

    function resolveView(step: ScrollStep, viewport: HTMLDivElement) {
        const fallback = {
            cx: diagramData.width / 2,
            cy: diagramData.height / 2,
            scale: scaleFactor,
        };
        const group = computeGroupView(
            step.to,
            diagramBounds,
            viewport.clientWidth,
            viewport.clientHeight,
        );
        if (!group) return fallback;
        if (step.scale != null)
            return { cx: group.cx, cy: group.cy, scale: step.scale };
        return group;
    }
</script>

<svelte:window bind:innerWidth />

<ScrollerBase top={0} threshold={0.5} bottom={1} bind:index query="div.step">
    {#snippet backgroundSnippet()}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
            class="viewport"
            class:draggable={drag.isMousePointer}
            class:dragging={drag.isDragging}
            bind:this={viewportEl}
            onpointerdown={drag.handlePointerDown}
            onpointermove={drag.handlePointerMove}
            onpointerup={drag.handlePointerUp}
            onpointercancel={drag.handlePointerUp}
            onclick={() => (selectedNode = null)}
        >
            <div class="canvas" style:transform style:transition>
                <img
                    src={diagramSrc}
                    alt="系譜圖"
                    style:width="{canvasWidth}px"
                    style:height="{canvasHeight}px"
                    style:max-width="none"
                    draggable="false"
                />
                {#each hitTargets as t}
                    <button
                        class="hit-target"
                        aria-label={t.meta.label}
                        style:left="{t.x * scaleFactor}px"
                        style:top="{t.y * scaleFactor}px"
                        style:width="{t.width * scaleFactor}px"
                        style:height="{t.height * scaleFactor}px"
                        onclick={(e) => {
                            e.stopPropagation();
                            selectedNode =
                                selectedNode?.id === t.meta.id ? null : t.meta;
                        }}
                    ></button>
                {/each}
            </div>
        </div>
    {/snippet}
    {#snippet foregroundSnippet()}
        {#each steps as step, i}
            <div class="step">
                {#if step.text}
                    <div class="card">
                        {step.text}
                        {#if step.audios && index === i}
                            {#each step.audios as { src, name }}
                                <AudioProvider {src}>
                                    <p class="audio-name">{name}</p>
                                    <AudioWave />
                                </AudioProvider>
                            {/each}
                        {/if}
                    </div>
                {/if}
            </div>
        {/each}
    {/snippet}
</ScrollerBase>

{#if selectedNode && selectedNode.youtube}
    <div class="popup">
        <PopupBackground />
        <div class="popup-content">
            <div class="popup-close">
                <Button raw onclick={() => (selectedNode = null)}
                    ><span style:color="white">X</span></Button
                >
            </div>
            <h3 class="popup-title">{selectedNode.label}</h3>
            {#if selectedNode.youtube}
                <iframe
                    class="popup-youtube"
                    src={getYouTubeEmbedUrl(selectedNode.youtube)}
                    title={selectedNode.label}
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            {/if}
        </div>
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

    .viewport {
        width: 100vw;
        height: 100dvh;
        overflow: hidden;
        position: relative;
        touch-action: pan-y;
        border-top: 2px dashed #cac5bb;
        border-bottom: 2px dashed #cac5bb;
        background-image: url("https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/assets/pattern.svg");
    }

    .viewport.draggable {
        cursor: grab;
    }

    .viewport.dragging {
        cursor: grabbing;
        user-select: none;
    }

    .canvas {
        transform-origin: 0 0;
        will-change: transform;
        position: absolute;
        top: 0;
        left: 0;
    }

    .canvas img {
        display: block;
        pointer-events: none;
    }

    .hit-target {
        position: absolute;
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
    }

    .step {
        height: 60svh;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card {
        pointer-events: auto;
        background: rgba(255, 255, 255, 0.92);
        color: var(--back-900, #1a1a1a);
        padding: 16px 24px;
        max-width: 360px;
        line-height: 1.6;
        font-size: 16px;
    }

    .audio-name {
        margin-top: 20px;
        font-size: 14px;
        font-weight: 300;
    }

    .popup {
        position: fixed;
        top: 85px;
        right: 60px;
        width: clamp(250px, 70vw, 500px);
        padding: 0;
        padding-left: 30px;
        z-index: 100;
    }

    @media (max-width: 550px) {
        .popup {
            padding-left: 10px;
        }
    }

    .popup-content {
        position: relative;
        padding: 28px 24px 24px;
        color: var(--back-900, #1a1a1a);
    }

    .popup-close {
        position: absolute;
        top: 30px;
        right: 40px;
    }

    .popup-title {
        font-size: 20px;
        font-weight: 900;
        margin: 0 0 12px;
        color: white;
        max-width: 80%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    @media (max-width: 550px) {
        .popup-title {
            font-size: 18px;
        }
    }

    .popup-youtube {
        width: 100%;
        aspect-ratio: 16 / 9;
        border: none;
        border-radius: 8px;
    }
</style>
