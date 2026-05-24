<script lang="ts">
  import Button from '@/lib/components/ui/Button.svelte'
  import SidebarCard from '@/lib/components/ui/sidebar/SidebarCard.svelte'
  import SidebarCheckboxRow from '@/lib/components/ui/sidebar/SidebarCheckboxRow.svelte'
  import SidebarSection from '@/lib/components/ui/sidebar/SidebarSection.svelte'
  import type { GraphEdge, GraphNode } from '@/lib/features/editor/graph/flow'
  import type {
    EdgeFormState,
    NodeFormState,
  } from '@/lib/features/editor/graph/form'
  import type { Id } from '~convex/dataModel'

  let {
    selectedNode,
    selectedEdge,
    nodes,
    nodeForm = $bindable(),
    edgeForm = $bindable(),
    onsubmitNode,
    onsubmitEdge,
    ondeleteNode,
    ondeleteEdge,
    ontoggleNodeExpanded,
  }: {
    selectedNode?: GraphNode
    selectedEdge?: GraphEdge
    nodes: GraphNode[]
    nodeForm: NodeFormState
    edgeForm: EdgeFormState
    onsubmitNode: () => void
    onsubmitEdge: () => void
    ondeleteNode: (nodeId: Id<'nodes'>) => void
    ondeleteEdge: (edgeId: Id<'edges'>) => void
    ontoggleNodeExpanded: () => void
  } = $props()
</script>

<div class="tab-body">
  {#if selectedNode}
    <SidebarSection title="節點詳情">
      <div class="field">
        <label for="node-label">名稱</label>
        <input id="node-label" bind:value={nodeForm.label} />
      </div>
      <div class="field">
        <label for="node-category">分類</label>
        <input
          id="node-category"
          bind:value={nodeForm.categoryLabel}
          list="category-options"
        />
      </div>
      <div class="field">
        <label for="node-source">資料來源</label>
        <input id="node-source" bind:value={nodeForm.infoSource} />
      </div>
      <div class="field">
        <label for="node-note">備註</label>
        <textarea id="node-note" bind:value={nodeForm.note}></textarea>
      </div>
      <button
        class="toggle-row"
        type="button"
        onclick={() => ontoggleNodeExpanded()}
      >
        <SidebarCheckboxRow label="展開節點" checked={selectedNode.expanded} />
      </button>
      <div class="actions">
        <Button variant="filled" onclick={onsubmitNode}>儲存</Button>
        <Button
          variant="outlined"
          onclick={() => ondeleteNode(selectedNode._id)}
        >
          刪除
        </Button>
      </div>
    </SidebarSection>
  {:else if selectedEdge}
    <SidebarSection title="線段詳情">
      <SidebarCard>
        <span>{selectedEdge.sourceLabel} → {selectedEdge.targetLabel}</span>
      </SidebarCard>
      <div class="field">
        <label for="edge-label">關係</label>
        <input id="edge-label" bind:value={edgeForm.label} />
      </div>
      <button
        class="toggle-row"
        type="button"
        onclick={() => (edgeForm.directed = !edgeForm.directed)}
      >
        <SidebarCheckboxRow label="方向性" checked={edgeForm.directed} />
      </button>
      <div class="field">
        <label for="edge-source">資料來源</label>
        <input id="edge-source" bind:value={edgeForm.infoSource} />
      </div>
      <div class="field">
        <label for="edge-note">備註</label>
        <textarea id="edge-note" bind:value={edgeForm.note}></textarea>
      </div>
      <div class="actions">
        <Button variant="filled" onclick={onsubmitEdge}>儲存</Button>
        <Button
          variant="outlined"
          onclick={() => ondeleteEdge(selectedEdge._id)}
        >
          刪除
        </Button>
      </div>
    </SidebarSection>
  {:else}
    <SidebarSection title="新增節點">
      <div class="field">
        <label for="new-node-label">名稱</label>
        <input id="new-node-label" bind:value={nodeForm.label} />
      </div>
      <div class="field">
        <label for="new-node-category">分類</label>
        <input
          id="new-node-category"
          bind:value={nodeForm.categoryLabel}
          list="category-options"
          placeholder="輸入新分類可自動新增"
        />
      </div>
      <div class="field">
        <label for="new-node-source">資料來源</label>
        <input id="new-node-source" bind:value={nodeForm.infoSource} />
      </div>
      <div class="field">
        <label for="new-node-note">備註</label>
        <textarea id="new-node-note" bind:value={nodeForm.note}></textarea>
      </div>
      <Button variant="filled" onclick={onsubmitNode}>新增節點</Button>
    </SidebarSection>

    <SidebarSection title="新增線段">
      <div class="field">
        <label for="new-edge-source">起點</label>
        <select id="new-edge-source" bind:value={edgeForm.source}>
          <option value="">選擇節點</option>
          {#each nodes as node (node._id)}
            <option value={node._id}>{node.label}</option>
          {/each}
        </select>
      </div>
      <div class="field">
        <label for="new-edge-target">終點</label>
        <select id="new-edge-target" bind:value={edgeForm.target}>
          <option value="">選擇節點</option>
          {#each nodes as node (node._id)}
            <option value={node._id}>{node.label}</option>
          {/each}
        </select>
      </div>
      <div class="field">
        <label for="new-edge-label">關係</label>
        <input id="new-edge-label" bind:value={edgeForm.label} />
      </div>
      <button
        class="toggle-row"
        type="button"
        onclick={() => (edgeForm.directed = !edgeForm.directed)}
      >
        <SidebarCheckboxRow label="方向性" checked={edgeForm.directed} />
      </button>
      <div class="field">
        <label for="new-edge-source-note">資料來源</label>
        <input id="new-edge-source-note" bind:value={edgeForm.infoSource} />
      </div>
      <div class="field">
        <label for="new-edge-note">備註</label>
        <textarea id="new-edge-note" bind:value={edgeForm.note}></textarea>
      </div>
      <Button variant="filled" onclick={onsubmitEdge}>新增線段</Button>
    </SidebarSection>
  {/if}
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

  input,
  textarea,
  select {
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

  textarea {
    min-height: 74px;
    resize: vertical;
  }

  .actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .toggle-row {
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    text-align: inherit;
  }
</style>
