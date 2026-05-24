<script lang="ts">
  import { defaultNodeStyle } from '@/lib/constants/styles'
  import type { FlowNode } from '@/lib/features/canvas/types'
  import { Handle, Position, type NodeProps } from '@xyflow/svelte'

  let {
    data,
    selected,
    targetPosition = Position.Left,
    sourcePosition = Position.Right,
  }: NodeProps<FlowNode> = $props()
</script>

<div
  class="graph-node"
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
  role="presentation"
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

  {#if data.tooltipsEnabled && !data.expanded}
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

      {#if data.note || data.infoSource}
        <div class="detail">
          {#if data.note}
            <p class="note">{data.note}</p>
          {/if}

          {#if data.infoSource}
            <p class="source">資料來源｜{data.infoSource}</p>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .graph-node {
    position: relative;
    min-width: 76px;
    max-width: 156px;
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
    background: var(--node-background-color);
    transition:
      width 160ms ease,
      background-color 160ms ease;
  }

  .graph-node.selected .card {
    outline: 2px solid var(--supportive-heavy);
    outline-offset: 3px;
  }

  .graph-node.expanded .card {
    padding: 5px;
    background: color-mix(
      in srgb,
      var(--node-background-color) 76%,
      transparent
    );
    backdrop-filter: blur(5px);
  }

  .graph-node .title {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 5px;
    text-align: center;
    min-height: 40px;
    padding: 5px 10px 8px;
    border-radius: 5px;
    background: #f0d5be;
    color: var(--node-text-color);
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 0.6px;
    line-height: 1.2;
  }

  .graph-node .body {
    margin: 0;
    padding: 5px 10px;
    background: var(--node-description-background-color);
    color: var(--node-description-text-color);
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.6px;
    line-height: 1.35;
  }

  .graph-node .node-popup {
    visibility: hidden;
    position: absolute;
    top: 0;
    left: calc(100% + 14px);
    z-index: 99;
    display: flex;
    align-items: stretch;
    border: 1px solid var(--neutral-gray-200);
    border-radius: 7px;
    overflow: hidden;
    background: var(--neutral-white);
  }

  .graph-node:hover .node-popup {
    visibility: inherit;
  }

  .node-popup .summary {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
    padding: 5px 10px 8px;
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
    flex-direction: column;
    gap: 4px;
    padding: 5px 10px 8px;
    width: 200px;
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
