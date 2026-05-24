<script lang="ts">
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
    createEdgeFormFromEdge,
    createEmptyEdgeForm,
    createEmptyNodeForm,
    createNodeFormFromNode,
    toEdgeInput,
    toNodeInput,
    type EdgeDetails,
    type NodeForm,
  } from '@/lib/features/editor/graph/form'
  import {
    getEdgeSnapshot,
    getNodeDeleteSnapshot,
    getNodeSnapshot,
  } from '@/lib/features/editor/snapshots'
  import { useHistory } from '@/lib/features/use-history.svelte'
  import { route } from '@/routes/router'
  import { useConvexClient, useQuery } from 'convex-svelte'
  import { api } from '~convex/api'
  import type { Id } from '~convex/dataModel'
  import EmptyState from '../../ui/EmptyState.svelte'

  const convex = useConvexClient()
  const history = useHistory()
  const canvasState = getCanvasContext()

  const graphId = route.params.graphId as Id<'graphs'>
  const graph = useQuery(api.graphs.getGraph, { graphId })
  const categories = useQuery(api.graphs.listCategories, () => ({}))

  let nodeForm = $state(createEmptyNodeForm())
  let edgeForm = $state(createEmptyEdgeForm())

  const selectedNode = $derived.by(() => {
    return getSelectedGraphNode(graph.data, canvasState.selectedItem)
  })
  const selectedEdge = $derived.by(() => {
    return getSelectedGraphEdge(graph.data, canvasState.selectedItem)
  })

  $effect(() => {
    if (selectedNode) {
      nodeForm = createNodeFormFromNode(selectedNode)
    } else if (selectedEdge) {
      edgeForm = createEdgeFormFromEdge(selectedEdge)
    }
  })

  async function updateNodeDetails(nodeId: Id<'nodes'>, input: NodeForm) {
    await convex.mutation(api.graphs.updateNodeDetails, {
      nodeId,
      label: input.label,
      categoryLabel: input.categoryLabel,
      infoSource: input.infoSource,
      note: input.note,
    })
  }

  async function updateEdgeDetails(edgeId: Id<'edges'>, input: EdgeDetails) {
    await convex.mutation(api.graphs.updateEdgeDetails, {
      edgeId,
      label: input.label,
      directed: input.directed,
      infoSource: input.infoSource,
      note: input.note,
    })
  }

  async function deleteNodeById(nodeId: Id<'nodes'>) {
    await convex.mutation(api.graphs.deleteNode, { nodeId })
  }

  async function deleteEdgeById(edgeId: Id<'edges'>) {
    await convex.mutation(api.graphs.deleteEdge, { edgeId })
  }

  async function submitNode() {
    if (!selectedNode) return

    const input = toNodeInput(nodeForm, categories.data?.[0]?.label || '未分類')

    if (!input.label.trim()) return

    const nodeId = selectedNode._id
    const previous = getNodeSnapshot(graph.data, nodeId)

    await updateNodeDetails(nodeId, input)
    nodeForm = createNodeFormFromNode(input)

    if (previous) {
      history.record({
        undo: async () => {
          await updateNodeDetails(nodeId, previous)
        },
        redo: async () => {
          await updateNodeDetails(nodeId, input)
        },
      })
    }
  }

  async function submitEdge() {
    if (!selectedEdge) return

    const input = toEdgeInput(edgeForm)
    const edgeId = selectedEdge._id
    const previous = getEdgeSnapshot(graph.data, edgeId)

    await updateEdgeDetails(edgeId, input)
    edgeForm = createEdgeFormFromEdge({
      source: selectedEdge.source,
      target: selectedEdge.target,
      ...input,
    })

    if (previous) {
      history.record({
        undo: async () => {
          await updateEdgeDetails(edgeId, previous)
        },
        redo: async () => {
          await updateEdgeDetails(edgeId, input)
        },
      })
    }
  }

  async function deleteNode(nodeId: Id<'nodes'>) {
    const snapshot = getNodeDeleteSnapshot(graph.data, nodeId)
    let currentNodeId = nodeId

    await deleteNodeById(nodeId)

    if (snapshot) {
      history.record({
        undo: async () => {
          const restored = await convex.mutation(
            api.graphs.restoreNodeSnapshot,
            {
              graphId,
              node: snapshot.node,
              edges: snapshot.edges,
            },
          )

          currentNodeId = restored.nodeId
        },
        redo: async () => {
          await deleteNodeById(currentNodeId)
        },
      })
    }
  }

  async function deleteEdge(edgeId: Id<'edges'>) {
    const snapshot = getEdgeSnapshot(graph.data, edgeId)
    let currentEdgeId = edgeId

    await deleteEdgeById(edgeId)

    if (snapshot) {
      history.record({
        undo: async () => {
          currentEdgeId = await convex.mutation(
            api.graphs.restoreEdgeSnapshot,
            {
              graphId,
              edge: snapshot,
            },
          )
        },
        redo: async () => {
          await deleteEdgeById(currentEdgeId)
        },
      })
    }
  }

  async function toggleNodeExpanded() {
    if (!selectedNode) return

    await convex.mutation(api.graphs.setNodeExpanded, {
      nodeId: selectedNode._id,
      expanded: !selectedNode.expanded,
    })
  }
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
          list="details-category-options"
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
        onclick={() => void toggleNodeExpanded()}
      >
        <SidebarCheckboxRow label="展開節點" checked={selectedNode.expanded} />
      </button>
      <div class="actions">
        <Button variant="filled" onclick={() => void submitNode()}>儲存</Button>
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
        <Button variant="filled" onclick={() => void submitEdge()}>儲存</Button>
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
  {#each categories.data ?? [] as category (category._id)}
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
