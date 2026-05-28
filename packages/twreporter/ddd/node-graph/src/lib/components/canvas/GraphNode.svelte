<script lang="ts">
  import { defaultFadedOpacity, defaultNodeStyle } from '@/lib/constants/styles'
  import type { FlowNode } from '@/lib/features/canvas/types'
  import { Handle, Panel, Position, type NodeProps } from '@xyflow/svelte'
  import { getCanvasContext } from './CanvasState.svelte'

  let {
    data,
    selected,
    targetPosition = Position.Left,
    sourcePosition = Position.Right,
    zIndex,
    id,
  }: NodeProps<FlowNode> = $props()

  let isPopupOpen = $state(false)

  const canvasState = getCanvasContext()
</script>

<div
  class={['graph-node', { image: !!data.imageUrl }]}
  style:--node-background-color={data.backgroundColor ??
    defaultNodeStyle.backgroundColor}
  style:--node-border-color={data.borderColor ?? defaultNodeStyle.borderColor}
  style:--node-text-color={data.textColor ?? defaultNodeStyle.textColor}
  style:--node-description-background-color={data.descriptionBackgroundColor ??
    defaultNodeStyle.descriptionBackgroundColor}
  style:--node-description-text-color={data.descriptionTextColor ??
    defaultNodeStyle.descriptionTextColor}
  class:expanded={data.expanded}
  class:selected
  style:z-index={zIndex}
  style:opacity={canvasState.fadeNotConnectedNodes &&
  canvasState.selectedItem?.type === 'graph-node'
    ? canvasState.selectedItemConnectedNodeIds?.includes(id) ||
      canvasState.selectedItem.id === id
      ? 1
      : defaultFadedOpacity
    : 1}
  role="presentation"
  onmouseenter={() => {
    canvasState.activeHoveredNodeData = data
  }}
  onmouseleave={() => {
    canvasState.activeHoveredNodeData = null
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
      <div class="title">
        {#if data.imageUrl}
          <img alt={data.label} src={data.imageUrl} />
        {/if}
        {data.label}
      </div>
    {/if}

    {#if data?.expanded && data.note}
      <p class="body">{data.note}</p>
    {/if}
  </div>
</div>

<style>
  .graph-node {
    position: relative;
    pointer-events: auto;
    z-index: 10;
  }

  .graph-node.image {
    /* Here */
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
    max-width: 188px;
  }

  .graph-node .card {
    display: flex;
    flex-direction: column;
    gap: 1px;
    border-radius: 3px;
    background: var(--node-background-color);
    transition:
      width 160ms ease,
      background-color 160ms ease;
  }

  .graph-node.selected .card {
    outline: 5px solid #00000010;
    outline-offset: 0px;
  }

  .graph-node.expanded .card {
    padding: 2px;
    background: var(--node-description-background-color);
  }

  .graph-node .title {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 5px;
    text-align: center;
    min-height: 40px;
    padding: 5px 10px 8px;
    border-radius: 3px;
    background: var(--node-background-color);
    color: var(--node-text-color);
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 0.6px;
  }

  .graph-node .body {
    margin: 0;
    padding: 5px 10px;
    color: var(--node-description-text-color);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.6px;
    line-height: 1.35;
  }
</style>
