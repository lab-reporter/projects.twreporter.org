<script lang="ts">
    import { Handle, Position, type NodeProps } from '@xyflow/svelte'
    import type { FlowNode } from './types'

    let {
        data,
        targetPosition = Position.Left,
        sourcePosition = Position.Right,
    }: NodeProps<FlowNode> = $props()

    let isHovered = $state(false)
</script>

<div
    class="graph-node"
    class:expanded={data?.expanded}
    role="presentation"
    onpointerenter={() => {
        isHovered = true
    }}
    onpointerleave={() => {
        isHovered = false
    }}
>
    <Handle
        type="target"
        position={targetPosition}
        class="handle"
        aria-label="target handle"
    />
    <Handle
        type="source"
        position={sourcePosition}
        class="handle"
        aria-label="source handle"
    />

    <div class="card">
        {#if data?.label}
            <div class="title">{data.label}</div>
        {/if}

        {#if data?.expanded && data.note}
            <p class="body">{data.note}</p>
        {/if}
    </div>

    {#if isHovered && data}
        <div class="node-popup nodrag nopan">
            <div class="summary">
                {#if data.label}
                    <div class="name">{data.label}</div>
                {/if}
                {#if data.categoryLabel}
                    <div
                        class="category"
                        style={`--category-color: ${data.categoryColor};`}
                    >
                        {data.categoryLabel}
                    </div>
                {/if}
            </div>

            <div class="detail">
                {#if data.note}
                    <p class="note">{data.note}</p>
                {/if}

                {#if data.infoSource}
                    <p class="source">資料來源｜{data.infoSource}</p>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .graph-node {
        position: relative;
        width: 76px;
        pointer-events: auto;
    }

    .graph-node :global(.handle) {
        width: 2px;
        height: 2px;
        min-width: 2px;
        min-height: 2px;
        border: 0;
        background: transparent;
        opacity: 0;
        pointer-events: none;
    }

    .graph-node.expanded {
        width: 191px;
    }

    .graph-node .card {
        display: flex;
        flex-direction: column;
        gap: 2px;
        border-radius: 7px;
        background: var(--chart-earth-1);
        transition:
            width 160ms ease,
            background-color 160ms ease;
    }

    .graph-node.expanded .card {
        padding: 5px;
        background: color-mix(in srgb, var(--chart-earth-1) 76%, transparent);
        backdrop-filter: blur(5px);
    }

    .graph-node .title {
        display: flex;
        align-items: center;
        min-height: 40px;
        padding: 5px 10px 8px;
        border-radius: 5px;
        background: var(--chart-earth-2);
        color: var(--neutral-gray-800);
        font-size: 18px;
        font-weight: 500;
        letter-spacing: 0.6px;
        line-height: 1.2;
    }

    .graph-node .body {
        margin: 0;
        padding: 5px 10px;
        color: var(--neutral-gray-800);
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0.6px;
        line-height: 1.35;
    }

    .node-popup {
        position: absolute;
        top: 0;
        left: calc(100% + 14px);
        z-index: 20;
        display: flex;
        align-items: stretch;
        min-width: 272px;
        border: 1px solid var(--neutral-gray-200);
        border-radius: 7px;
        background: var(--neutral-white);
    }

    .node-popup .summary {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 8px;
        padding: 5px 10px 8px;
        border-top-left-radius: 7px;
        border-bottom-left-radius: 7px;
        background: var(--neutral-white);
    }

    .node-popup .name {
        color: var(--neutral-gray-800);
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.6px;
        line-height: 1.2;
        white-space: nowrap;
    }

    .node-popup .category {
        align-self: flex-start;
        padding: 2px 4px 3px;
        border-radius: 4px;
        background: var(--category-color, var(--chart-earth-2));
        color: var(--neutral-gray-800);
        font-size: 8px;
        font-weight: 500;
        letter-spacing: 0.6px;
        line-height: 1.5;
        white-space: nowrap;
    }

    .node-popup .detail {
        display: flex;
        width: 181px;
        flex-direction: column;
        gap: 4px;
        padding: 5px 10px 8px;
        border-top-right-radius: 7px;
        border-bottom-right-radius: 7px;
        background: var(--neutral-gray-200);
    }

    .node-popup .note {
        margin: 0;
        color: var(--neutral-gray-800);
        font-size: 10px;
        font-weight: 400;
        letter-spacing: 0.6px;
        line-height: 1.5;
    }

    .node-popup .source {
        margin: 0;
        color: var(--neutral-gray-500);
        font-size: 8px;
        font-weight: 500;
        letter-spacing: 0.6px;
        line-height: 1.5;
    }
</style>
