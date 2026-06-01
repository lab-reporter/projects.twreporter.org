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
    data.categoryColor ??
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

  {#if data.imageUrl}
    <div class="image-wrapper">
      <img alt={data.label} src={data.imageUrl} />
    </div>
    <div class="card">
      {#if data?.label}
        <div class="title">
          {data.label}
        </div>
      {/if}

      {#if data?.expanded && data.note}
        <p class="body">{data.note}</p>
      {/if}
    </div>
  {:else}
    <div class="card">
      {#if data?.label}
        <div class="title">
          {data.label}
        </div>
      {/if}

      {#if data?.expanded && data.note}
        <p class="body">{data.note}</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .graph-node {
    position: relative;
    pointer-events: auto;
    z-index: 10;
  }
  /* Style A */
  /* .graph-node.image {
    display: flex;
    flex-direction: row;
  }
  .image-wrapper {
    position: absolute;
    left: -25px;
    top: -6px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--node-background-color);
    border: 1px solid var(--node-border-color);
    overflow: hidden;
    transition: all 300ms ease;
  }
  .image-wrapper img {
    width: 100%;
    height: auto;
    object-fit: cover;
    mix-blend-mode: luminosity;
    filter: saturate(0);
  }
  .image-wrapper img:hover {
    mix-blend-mode: normal;
    filter: saturate(1);
    transition: all 300ms ease;
  }
  .graph-node.image .title {
    padding-left: 30px;
  }
  .graph-node.expanded .image-wrapper {
    left: -52px;
    top: 0px;
    width: 50px;
    height: auto;
    border-radius: 3px;
    border-width: 0;
    transition: all 300ms ease;
  }
  .graph-node.expanded.image .title {
    padding-left: 10px;
  } */

  /* Style B */
  .graph-node.image {
    display: flex;
    flex-direction: row;
  }
  .image-wrapper {
    position: absolute;
    left: calc(50% - 30px);
    top: -55px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--node-background-color);
    border: 3px solid var(--node-border-color);
    overflow: hidden;
    transition: all 300ms ease;
  }
  .image-wrapper img {
    width: 100%;
    height: auto;
    object-fit: cover;
    mix-blend-mode: luminosity;
    filter: saturate(0);
  }
  .image-wrapper img:hover {
    mix-blend-mode: normal;
    filter: saturate(1);
    transition: all 300ms ease;
  }
  .graph-node.image .title {
    font-size: 16px;
    background: #F1F1F1;
    padding-left: 10px;
    font-weight: 700;
  }
  .graph-node.expanded .image-wrapper {
    left: -52px;
    top: 0px;
    width: 50px;
    height: auto;
    border-radius: 3px;
    border-width: 0;
    transition: all 300ms ease;
  }
  .graph-node.expanded.image .title {
    background: var(--node-background-color);
    padding-left: 10px;
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
    padding: 5px 10px;
    border-radius: 3px;
    background: var(--node-background-color);
    color: var(--node-text-color);
    font-size: 18px;
    font-weight: 450;
    letter-spacing: 0.6px;
  }

  .graph-node .body {
    margin: 0;
    padding: 5px 10px;
    color: var(--node-description-text-color);
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.6px;
    line-height: 1.35;
  }
</style>
