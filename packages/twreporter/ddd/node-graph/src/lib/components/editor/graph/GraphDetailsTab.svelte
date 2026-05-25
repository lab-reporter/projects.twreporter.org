<script lang="ts">
  import { GraphApi } from '@/lib/apis/graph.svelte'
  import { getCanvasContext } from '@/lib/components/canvas/CanvasState.svelte'
  import Button from '@/lib/components/ui/Button.svelte'
  import SidebarCard from '@/lib/components/ui/sidebar/SidebarCard.svelte'
  import SidebarCheckboxRow from '@/lib/components/ui/sidebar/SidebarCheckboxRow.svelte'
  import SidebarSection from '@/lib/components/ui/sidebar/SidebarSection.svelte'
  import {
    getSelectedGraphEdge,
    getSelectedGraphNode,
  } from '@/lib/features/editor/graph/flow'
  import {
    getEdgeSnapshot,
    getNodeDeleteSnapshot,
  } from '@/lib/features/editor/snapshots'
  import { useHistory } from '@/lib/features/use-history.svelte'
  import type { Id } from '~convex/dataModel'
  import EmptyState from '../../ui/EmptyState.svelte'
  import { useConvexOptimisticUpdateValue } from '@/lib/features/use-convex-field.svelte'

  const graphApi = new GraphApi()
  const history = useHistory()
  const canvasState = getCanvasContext()

  const selectedNode = $derived.by(() => {
    return getSelectedGraphNode(
      graphApi.graphData.data,
      canvasState.selectedItem,
    )
  })
  const selectedEdge = $derived.by(() => {
    return getSelectedGraphEdge(
      graphApi.graphData.data,
      canvasState.selectedItem,
    )
  })

  const nodeLabel = useConvexOptimisticUpdateValue(
    () => selectedNode?.label ?? '',
    (label: string) =>
      selectedNode &&
      void graphApi.updateNodeDetails({
        nodeId: selectedNode._id,
        patch: { label },
      }),
  )
  const nodeCategoryLabel = useConvexOptimisticUpdateValue(
    () => selectedNode?.categoryLabel ?? '',
    (categoryLabel: string) =>
      selectedNode &&
      void graphApi.updateNodeDetails({
        nodeId: selectedNode._id,
        patch: { categoryLabel },
      }),
  )
  const nodeInfoSource = useConvexOptimisticUpdateValue(
    () => selectedNode?.infoSource ?? '',
    (infoSource: string) =>
      selectedNode &&
      void graphApi.updateNodeDetails({
        nodeId: selectedNode._id,
        patch: { infoSource },
      }),
  )
  const nodeNote = useConvexOptimisticUpdateValue(
    () => selectedNode?.note ?? '',
    (note: string) =>
      selectedNode &&
      void graphApi.updateNodeDetails({
        nodeId: selectedNode._id,
        patch: { note },
      }),
  )
  const nodeImageUrl = useConvexOptimisticUpdateValue(
    () => selectedNode?.imageUrl ?? '',
    (imageUrl: string) =>
      selectedNode &&
      void graphApi.updateNodeDetails({
        nodeId: selectedNode._id,
        patch: { imageUrl },
      }),
  )
  const edgeLabel = useConvexOptimisticUpdateValue(
    () => selectedEdge?.label ?? '',
    (label: string) =>
      selectedEdge &&
      void graphApi.updateEdgeDetails({
        edgeId: selectedEdge._id,
        patch: { label },
      }),
  )
  const edgeDirected = useConvexOptimisticUpdateValue(
    () => selectedEdge?.directed ?? true,
    (directed: boolean) =>
      selectedEdge &&
      void graphApi.updateEdgeDetails({
        edgeId: selectedEdge._id,
        patch: { directed },
      }),
  )
  const edgeInfoSource = useConvexOptimisticUpdateValue(
    () => selectedEdge?.infoSource ?? '',
    (infoSource: string) =>
      selectedEdge &&
      void graphApi.updateEdgeDetails({
        edgeId: selectedEdge._id,
        patch: { infoSource },
      }),
  )
  const edgeNote = useConvexOptimisticUpdateValue(
    () => selectedEdge?.note ?? '',
    (note: string) =>
      selectedEdge &&
      void graphApi.updateEdgeDetails({
        edgeId: selectedEdge._id,
        patch: { note },
      }),
  )

  async function deleteNode(nodeId: Id<'nodes'>) {
    const snapshot = getNodeDeleteSnapshot(graphApi.graphData.data, nodeId)
    let currentNodeId = nodeId

    await graphApi.deleteNode({ nodeId })
    canvasState.selectedItem = null
    canvasState.selectedItems = []

    if (snapshot) {
      history.record({
        undo: async () => {
          const restored = await graphApi.restoreNodeSnapshot({
            node: snapshot.node,
            edges: snapshot.edges,
          })

          if (!restored) return

          currentNodeId = restored.nodeId
        },
        redo: async () => {
          await graphApi.deleteNode({ nodeId: currentNodeId })
        },
      })
    }
  }

  async function deleteEdge(edgeId: Id<'edges'>) {
    const snapshot = getEdgeSnapshot(graphApi.graphData.data, edgeId)
    let currentEdgeId = edgeId

    await graphApi.deleteEdge({ edgeId })
    canvasState.selectedItem = null
    canvasState.selectedItems = []

    if (snapshot) {
      history.record({
        undo: async () => {
          const restoredEdgeId = await graphApi.restoreEdgeSnapshot({
            edge: snapshot,
          })

          if (!restoredEdgeId) return

          currentEdgeId = restoredEdgeId
        },
        redo: async () => {
          await graphApi.deleteEdge({ edgeId: currentEdgeId })
        },
      })
    }
  }

  async function toggleNodeExpanded() {
    if (!selectedNode) return

    await graphApi.updateNodeDetails({
      nodeId: selectedNode._id,
      patch: { expanded: !selectedNode.expanded },
    })
  }
</script>

<div class="tab-body">
  {#if selectedNode}
    <SidebarSection title="節點詳情">
      <div class="field">
        <label for="node-label">名稱</label>
        <input id="node-label" bind:value={nodeLabel.value} />
      </div>
      <div class="field">
        <label for="node-category">分類</label>
        <input
          id="node-category"
          bind:value={nodeCategoryLabel.value}
          list="details-category-options"
        />
      </div>
      <div class="field">
        <label for="node-source">資料來源</label>
        <input id="node-source" bind:value={nodeInfoSource.value} />
      </div>
      <div class="field">
        <label for="node-note">備註</label>
        <textarea id="node-note" bind:value={nodeNote.value}></textarea>
      </div>
      <div class="field">
        <label for="node-image-url">照片 URL</label>
        <input id="node-image-url" bind:value={nodeImageUrl.value} />
      </div>
      <button
        class="toggle-row"
        type="button"
        onclick={() => void toggleNodeExpanded()}
      >
        <SidebarCheckboxRow label="展開節點" checked={selectedNode.expanded} />
      </button>
      <div class="actions">
        <Button
          variant="outlined"
          onclick={() => void deleteNode(selectedNode._id)}
        >
          刪除
        </Button>
      </div>
    </SidebarSection>
  {:else if selectedEdge}
    <SidebarSection title="線段詳情">
      <SidebarCard>
        <span>{selectedEdge.sourceLabel} -> {selectedEdge.targetLabel}</span>
      </SidebarCard>
      <div class="field">
        <label for="edge-label">關係</label>
        <input id="edge-label" bind:value={edgeLabel.value} />
      </div>
      <button
        class="toggle-row"
        type="button"
        onclick={() => (edgeDirected.value = !edgeDirected.value)}
      >
        <SidebarCheckboxRow label="方向性" checked={edgeDirected.value} />
      </button>
      <div class="field">
        <label for="edge-source">資料來源</label>
        <input id="edge-source" bind:value={edgeInfoSource.value} />
      </div>
      <div class="field">
        <label for="edge-note">備註</label>
        <textarea id="edge-note" bind:value={edgeNote.value}></textarea>
      </div>
      <div class="actions">
        <Button
          variant="outlined"
          onclick={() => void deleteEdge(selectedEdge._id)}
        >
          刪除
        </Button>
      </div>
    </SidebarSection>
  {:else}
    <SidebarSection title="詳情">
      <EmptyState message="請先在畫布選取一個節點或線段" />
    </SidebarSection>
  {/if}
</div>

<datalist id="details-category-options">
  {#each graphApi.categories.data ?? [] as category (category._id)}
    <option value={category.label}></option>
  {/each}
</datalist>

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
  textarea {
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
