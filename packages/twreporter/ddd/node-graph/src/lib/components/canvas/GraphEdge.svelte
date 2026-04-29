<script lang="ts">
    import { BaseEdge, EdgeLabel, type EdgeProps } from '@xyflow/svelte'
    import type { FlowEdge } from './types'

    let {
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        data,
    }: EdgeProps<FlowEdge> = $props()

    let isHovered = $state(false)

    const edgePath = $derived(`M ${sourceX} ${sourceY} L ${targetX} ${targetY}`)

    const labelPosition = $derived.by(() => ({
        x: (sourceX + targetX) / 2,
        y: (sourceY + targetY) / 2,
    }))

    const labelAngle = $derived.by(() => {
        const dx = targetX - sourceX
        const dy = targetY - sourceY

        return (Math.atan2(dy, dx) * 180) / Math.PI
    })

    const markerId = $derived(
        `graph-edge-arrow-${id.replace(/[^a-zA-Z0-9_-]/g, '-')}`,
    )
</script>

<defs>
    {#if data?.directed}
        <marker
            id={markerId}
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="5"
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
        >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--neutral-gray-800)" />
        </marker>
    {/if}
</defs>

<g
    role="presentation"
    onpointerenter={() => {
        isHovered = true
    }}
    onpointerleave={() => {
        isHovered = false
    }}
>
    <BaseEdge
        {id}
        path={edgePath}
        markerEnd={data?.directed ? `url(#${markerId})` : undefined}
        style="stroke: var(--neutral-gray-800); stroke-width: 1.1; fill: none;"
        interactionWidth={24}
    />

    {#if data?.relationLabel}
        <EdgeLabel x={labelPosition.x} y={labelPosition.y} transparent>
            <div
                class="edge-chip nodrag nopan"
                role="presentation"
                style={`transform: rotate(${labelAngle}deg);`}
                onpointerenter={() => {
                    isHovered = true
                }}
                onpointerleave={() => {
                    isHovered = false
                }}
            >
                <span>{data.relationLabel}</span>
            </div>
        </EdgeLabel>
    {/if}

    {#if isHovered && data}
        <EdgeLabel x={labelPosition.x} y={labelPosition.y} transparent>
            <div class="edge-popup nodrag nopan">
                {#if data.sourceLabel && data.targetLabel}
                    <div class="title">
                        {data.sourceLabel} → {data.targetLabel}
                    </div>
                {/if}

                {#if data.relationLabel}
                    <div class="pill">{data.relationLabel}</div>
                {/if}

                {#if data.note}
                    <p class="note">{data.note}</p>
                {/if}

                {#if data.infoSource}
                    <p class="source">資料來源｜{data.infoSource}</p>
                {/if}
            </div>
        </EdgeLabel>
    {/if}
</g>

<style>
    .edge-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        border-radius: 2px;
        background: var(--neutral-gray-100);
        color: var(--neutral-gray-800);
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.6px;
        line-height: 1.2;
        transform-origin: center;
    }

    .edge-popup {
        position: absolute;
        left: 12px;
        top: 14px;
        min-width: 180px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 10px 12px;
        border: 1px solid var(--neutral-gray-200);
        border-radius: 8px;
        background: var(--neutral-white);
    }

    .edge-popup .title {
        color: var(--neutral-gray-800);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.35;
    }

    .edge-popup .pill {
        align-self: flex-start;
        padding: 2px 6px;
        border-radius: 999px;
        background: var(--neutral-gray-100);
        color: var(--neutral-gray-800);
        font-size: 9px;
        font-weight: 500;
        line-height: 1.2;
    }

    .edge-popup .note {
        margin: 0;
        color: var(--neutral-gray-700);
        font-size: 11px;
        line-height: 1.4;
    }

    .edge-popup .source {
        margin: 0;
        color: var(--neutral-gray-500);
        font-size: 9px;
        line-height: 1.4;
    }
</style>
