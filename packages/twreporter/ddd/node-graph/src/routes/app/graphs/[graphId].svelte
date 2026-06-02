<script lang="ts">
  import Canvas from '@/lib/components/canvas/Canvas.svelte'
  import { getCanvasContext } from '@/lib/components/canvas/CanvasState.svelte'
  import GraphDesignsTab from '@/lib/components/editor/graph/GraphDesignsTab.svelte'
  import GraphDetailsTab from '@/lib/components/editor/graph/GraphDetailsTab.svelte'
  import GraphNodesAndEdgesTab from '@/lib/components/editor/graph/GraphNodesAndEdgesTab.svelte'
  import GraphSearchTab from '@/lib/components/editor/graph/GraphSearchTab.svelte'
  import GraphTopBar from '@/lib/components/editor/graph/GraphTopBar.svelte'
  import Header from '@/lib/components/editor/Header.svelte'
  import { GraphApi } from '@/lib/apis/graph.svelte'
  import Sidebar from '@/lib/components/ui/Sidebar.svelte'
  import TabContent from '@/lib/components/ui/tabs/TabContent.svelte'
  import { getTabsContext } from '@/lib/components/ui/tabs/TabsState.svelte'
  import { buildGraphFlow } from '@/lib/features/canvas/adapter'
  import type {
    CanvasSelectedItem,
    NodePositionMove,
  } from '@/lib/features/canvas/types'
  import { useAutoLayout } from '@/lib/features/canvas/use-auto-layout.svelte'
  import { filterGraphNodes } from '@/lib/features/editor/graph/flow'
  import {
    createEmptyEdgeForm,
    createEmptyNodeForm,
    toEdgeInput,
    toNodeInput,
    type EdgeForm,
  } from '@/lib/features/editor/graph/form'
  import { useHistory } from '@/lib/features/use-history.svelte'
  import { useSvelteFlow } from '@xyflow/svelte'
  import { useQuery } from 'convex-svelte'
  import { api } from '~convex/api'
  import type { Id } from '~convex/dataModel'
  import NodePopup from '@/lib/components/canvas/Popup.svelte'

  const graphApi = new GraphApi()
  const history = useHistory()
  const { getNodes, getEdges, updateNode, updateEdge } = useSvelteFlow()
  const autoLayout = useAutoLayout({
    getNodes: () => flow.nodes,
    getEdges: () => flow.edges,
    onMoveNodes: (moves) => persistNodeMoves(moves, 'to'),
    onUndoMoveNodes: (moves) => persistNodeMoves(moves, 'from'),
  })
  const canvasState = getCanvasContext()
  const tabsState = getTabsContext('add')

  const graphId = graphApi.params.graphId

  const designs = useQuery(api.designs.listDesignsForGraph, { graphId })

  const sidebarTabs = {
    add: 'add',
    details: 'details',
    search: 'search',
    design: 'design',
  } as const

  let nodeForm = $state(createEmptyNodeForm())
  let edgeForm = $state(createEmptyEdgeForm())
  let searchTerm = $state('')

  let pendingSelectedItem = $state<CanvasSelectedItem | null>(null)

  const flow = $derived(
    buildGraphFlow({
      canvasState,
      graph: graphApi.graphData.data,
      readonly: false,
      tooltipsEnabled: canvasState.tooltipsEnabled,
    }),
  )
  const filteredNodes = $derived.by(() => {
    return filterGraphNodes(graphApi.graphData.data?.nodes ?? [], searchTerm)
  })

  $effect(() => {
    if (!pendingSelectedItem) return
    flow.nodes.length
    flow.edges.length

    if (applyFlowSelection(pendingSelectedItem)) {
      pendingSelectedItem = null
    }
  })

  async function persistNodeMoves(
    moves: NodePositionMove[],
    direction: 'from' | 'to',
  ) {
    await graphApi.updateNodePositions({
      moves: moves.map((move) => ({
        nodeId: move.nodeId as Id<'nodes'>,
        position: move[direction],
      })),
    })
  }

  function applyFlowSelection(selectedItem: CanvasSelectedItem | null) {
    let found = selectedItem === null

    for (const node of getNodes()) {
      const selected =
        selectedItem?.type === 'graph-node' && selectedItem.id === node.id
      if (selected) found = true
      updateNode(node.id, { selected })
    }

    for (const edge of getEdges()) {
      const selected =
        selectedItem?.type === 'graph-edge' && selectedItem.id === edge.id
      if (selected) found = true
      updateEdge(edge.id, { selected })
    }

    return found
  }

  function selectItem(selectedItem: CanvasSelectedItem | null) {
    pendingSelectedItem = applyFlowSelection(selectedItem) ? null : selectedItem
  }

  function selectNode(nodeId: Id<'nodes'>) {
    selectItem({ type: 'graph-node', id: nodeId })
  }

  function selectEdge(edgeId: Id<'edges'>) {
    selectItem({ type: 'graph-edge', id: edgeId })
  }

  function clearSelection() {
    selectItem(null)
  }

  async function deleteNodeById(nodeId: Id<'nodes'>) {
    await graphApi.deleteNode({ nodeId })
    clearSelection()
  }

  async function deleteEdgeById(edgeId: Id<'edges'>) {
    await graphApi.deleteEdge({ edgeId })
    clearSelection()
  }

  async function createNode(input: {
    label: string
    categoryLabel: string
    infoSource?: string
    note?: string
  }) {
    if (!input.label.trim()) return

    const createdNodeId = await graphApi.createNode(input)

    if (!createdNodeId) return

    let currentNodeId: Id<'nodes'> = createdNodeId
    selectNode(currentNodeId)
    history.record({
      undo: async () => {
        await deleteNodeById(currentNodeId)
      },
      redo: async () => {
        const nextNodeId = await graphApi.createNode(input)

        if (!nextNodeId) return

        currentNodeId = nextNodeId
        selectNode(currentNodeId)
      },
    })
  }

  async function createEdge(input: EdgeForm) {
    if (!input.source || !input.target) return
    if (input.source === input.target) return

    const createdEdgeId = await graphApi.createEdge({
      source: input.source,
      target: input.target,
      label: input.label,
      directed: input.directed,
      infoSource: input.infoSource,
      note: input.note,
    })

    if (!createdEdgeId) return

    let currentEdgeId: Id<'edges'> = createdEdgeId
    selectEdge(currentEdgeId)
    history.record({
      undo: async () => {
        await deleteEdgeById(currentEdgeId)
      },
      redo: async () => {
        const nextEdgeId = await graphApi.createEdge({
          source: input.source as Id<'nodes'>,
          target: input.target as Id<'nodes'>,
          label: input.label,
          directed: input.directed,
          infoSource: input.infoSource,
          note: input.note,
        })

        if (!nextEdgeId) return

        currentEdgeId = nextEdgeId
        selectEdge(currentEdgeId)
      },
    })
  }

  $effect(() => {
    if (canvasState.selectedItems.length > 0) {
      tabsState.activeTab = sidebarTabs.design
    }

    if (canvasState.selectedItem) {
      tabsState.activeTab = sidebarTabs.details
    }
  })
</script>

<Header title={graphApi.graphTitle.data ?? undefined} />

<GraphTopBar
  autoLayoutDisabled={autoLayout.busy || flow.nodes.length < 2}
  onAutoLayout={() => void autoLayout.applyAutoLayout()}
/>

<Sidebar
  tabs={[
    { label: '新增', value: sidebarTabs.add },
    { label: '詳情', value: sidebarTabs.details },
    { label: '搜尋', value: sidebarTabs.search },
    { label: '設計', value: sidebarTabs.design },
  ]}
>
  <TabContent value={sidebarTabs.add}>
    <GraphNodesAndEdgesTab
      nodes={graphApi.graphData.data?.nodes ?? []}
      bind:nodeForm
      bind:edgeForm
      onsubmitNode={() => {
        const input = toNodeInput(
          nodeForm,
          graphApi.categories.data?.[0]?.label || '未分類',
        )
        void createNode(input)
        nodeForm = createEmptyNodeForm(
          graphApi.categories.data?.[0]?.label ?? '',
        )
      }}
      onsubmitEdge={() => {
        const input = toEdgeInput(edgeForm)

        void createEdge(input)
        edgeForm = createEmptyEdgeForm()
      }}
    />
  </TabContent>

  <TabContent value={sidebarTabs.details}>
    <GraphDetailsTab />
  </TabContent>

  <TabContent value={sidebarTabs.search}>
    <GraphSearchTab
      bind:searchTerm
      nodes={filteredNodes}
      onselect={(nodeId) => {
        selectNode(nodeId)
        tabsState.activeTab = sidebarTabs.details
      }}
    />
  </TabContent>

  <TabContent value={sidebarTabs.design}>
    <GraphDesignsTab designs={designs.data ?? []} />
  </TabContent>

  {#snippet footer()}
    <datalist id="category-options">
      {#each graphApi.categories.data ?? [] as category (category._id)}
        <option value={category.label}></option>
      {/each}
    </datalist>
  {/snippet}
</Sidebar>
<Canvas
  nodes={flow.nodes}
  edges={flow.edges}
  onMoveNodes={(moves) => persistNodeMoves(moves, 'to')}
  onUndoMoveNodes={(moves) => persistNodeMoves(moves, 'from')}
>
  <div class="node-popup-container">
    <NodePopup />
  </div>
</Canvas>

<style>
  .node-popup-container {
    position: absolute;
    top: 25px;
    right: 25px;
    width: 300px;
  }
</style>
