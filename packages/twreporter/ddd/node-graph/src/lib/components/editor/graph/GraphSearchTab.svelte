<script lang="ts">
  import type { GraphNode } from '@/lib/features/editor/graph/flow'
  import type { Id } from '~convex/dataModel'

  let {
    searchTerm = $bindable(),
    nodes,
    onselect,
  }: {
    searchTerm: string
    nodes: GraphNode[]
    onselect: (nodeId: Id<'nodes'>) => void
  } = $props()
</script>

<div class="tab-body">
  <div class="field sticky-search">
    <label for="node-search">搜尋節點</label>
    <input id="node-search" bind:value={searchTerm} />
  </div>
  <div class="result-list">
    {#each nodes as node (node._id)}
      <button
        class="result-row"
        type="button"
        onclick={() => onselect(node._id)}
      >
        <span class="category-dot" style={`background: ${node.categoryColor};`}
        ></span>
        <span class="result-main">
          <span>{node.label}</span>
          <small>{node.categoryLabel}</small>
        </span>
        {#if node.infoSource}
          <span class="link-indicator">URL</span>
        {/if}
      </button>
    {/each}
  </div>
</div>

<style>
  .tab-body {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: var(--neutral-gray-800);
    font-size: 13px;
    font-weight: 500;
  }

  input {
    width: 100%;
    min-height: 34px;
    border: 1px solid var(--neutral-gray-300);
    border-radius: 4px;
    padding: 7px 9px;
    background: var(--neutral-white);
    color: var(--neutral-gray-800);
    font: inherit;
    box-sizing: border-box;
  }

  .sticky-search {
    position: sticky;
    top: 0;
    z-index: 1;
    padding-bottom: 4px;
    background: var(--neutral-gray-50);
  }

  .result-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .result-row {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: var(--neutral-gray-800);
    cursor: pointer;
    text-align: left;
  }

  .result-row:hover {
    background: var(--neutral-gray-100);
  }

  .category-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex: 0 0 auto;
  }

  .result-main {
    display: flex;
    min-width: 0;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 2px;
  }

  .result-main span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .result-main small,
  .link-indicator {
    color: var(--neutral-gray-500);
    font-size: 12px;
  }

  .link-indicator {
    flex: 0 0 auto;
  }
</style>
