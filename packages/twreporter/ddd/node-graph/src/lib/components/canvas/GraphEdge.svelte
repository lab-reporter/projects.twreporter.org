<script lang="ts">
  import type { FlowEdge } from '@/lib/features/canvas/types'
  import {
    BaseEdge,
    EdgeLabel,
    useInternalNode,
    type EdgeProps,
    type InternalNode,
  } from '@xyflow/svelte'

  type Point = {
    x: number
    y: number
  }

  type NodeBounds = {
    x: number
    y: number
    width: number
    height: number
  }

  let {
    id,
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    data,
  }: EdgeProps<FlowEdge> = $props()

  let isHovered = $state(false)

  // svelte-ignore state_referenced_locally
  const sourceNode = useInternalNode(source)
  // svelte-ignore state_referenced_locally
  const targetNode = useInternalNode(target)

  function getNodeBounds(
    node: InternalNode | undefined,
  ): NodeBounds | undefined {
    const width = node?.measured?.width ?? node?.width
    const height = node?.measured?.height ?? node?.height
    const position = node?.internals.positionAbsolute

    if (!position || !width || !height) return undefined

    return {
      x: position.x,
      y: position.y,
      width,
      height,
    }
  }

  function getCenter(bounds: NodeBounds): Point {
    return {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2,
    }
  }

  function getRectIntersection(from: NodeBounds, to: NodeBounds): Point {
    const fromCenter = getCenter(from)
    const toCenter = getCenter(to)
    const dx = toCenter.x - fromCenter.x
    const dy = toCenter.y - fromCenter.y

    if (dx === 0 && dy === 0) return fromCenter

    const scale = Math.min(
      dx === 0 ? Number.POSITIVE_INFINITY : from.width / 2 / Math.abs(dx),
      dy === 0 ? Number.POSITIVE_INFINITY : from.height / 2 / Math.abs(dy),
    )

    return {
      x: fromCenter.x + dx * scale,
      y: fromCenter.y + dy * scale,
    }
  }

  const connectionPoints = $derived.by(() => {
    const sourceBounds = getNodeBounds(sourceNode.current)
    const targetBounds = getNodeBounds(targetNode.current)

    if (!sourceBounds || !targetBounds) {
      return {
        source: { x: sourceX, y: sourceY },
        target: { x: targetX, y: targetY },
      }
    }

    return {
      source: getRectIntersection(sourceBounds, targetBounds),
      target: getRectIntersection(targetBounds, sourceBounds),
    }
  })

  const edgePath = $derived(
    `M ${connectionPoints.source.x} ${connectionPoints.source.y} L ${connectionPoints.target.x} ${connectionPoints.target.y}`,
  )

  const labelPosition = $derived.by(() => ({
    x: (connectionPoints.source.x + connectionPoints.target.x) / 2,
    y: (connectionPoints.source.y + connectionPoints.target.y) / 2,
  }))

  const labelAngle = $derived.by(() => {
    const dx = connectionPoints.target.x - connectionPoints.source.x
    const dy = connectionPoints.target.y - connectionPoints.source.y
    const arrowAngle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360

    if (
      (arrowAngle >= 45 && arrowAngle <= 135) ||
      (arrowAngle >= 225 && arrowAngle <= 315)
    ) {
      return 0
    }

    if (arrowAngle > 90 && arrowAngle < 270) {
      return arrowAngle - 180
    }

    return arrowAngle > 180 ? arrowAngle - 360 : arrowAngle
  })

  const markerId = $derived(
    `graph-edge-arrow-${id.replace(/[^a-zA-Z0-9_-]/g, '-')}`,
  )

  const strokeColor = $derived(data?.strokeColor ?? '#404040')
  const arrowColor = $derived(data?.arrowColor ?? strokeColor)
  const labelBackgroundColor = $derived(data?.labelBackgroundColor ?? '#F1F1F1')
  const labelTextColor = $derived(data?.labelTextColor ?? '#404040')
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
      <path d="M 0 0 L 10 5 L 0 10 z" fill={arrowColor} />
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
    style={`stroke: ${data?.selected ? 'var(--supportive-heavy)' : strokeColor}; stroke-width: ${data?.selected ? 2 : 1.1}; fill: none;`}
    interactionWidth={24}
  />

  {#if data?.relationLabel}
    <EdgeLabel x={labelPosition.x} y={labelPosition.y} transparent>
      <div
        class="edge-chip nodrag nopan"
        role="presentation"
        style={`transform: rotate(${labelAngle}deg); --edge-label-background-color: ${labelBackgroundColor}; --edge-label-text-color: ${labelTextColor};`}
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

  {#if isHovered && data && data.tooltipsEnabled}
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
    background: var(--edge-label-background-color);
    color: var(--edge-label-text-color);
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
