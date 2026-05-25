<script lang="ts">
  import Canvas from '@/lib/components/canvas/Canvas.svelte'
  import { getCanvasContext } from '@/lib/components/canvas/CanvasState.svelte'
  import GraphDesignsTab from '@/lib/components/editor/graph/GraphDesignsTab.svelte'
  import GraphDetailsTab from '@/lib/components/editor/graph/GraphDetailsTab.svelte'
  import GraphNodesAndEdgesTab from '@/lib/components/editor/graph/GraphNodesAndEdgesTab.svelte'
  import GraphSearchTab from '@/lib/components/editor/graph/GraphSearchTab.svelte'
  import GraphTopBar from '@/lib/components/editor/graph/GraphTopBar.svelte'
  import Header from '@/lib/components/editor/Header.svelte'
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
  import { route } from '@/routes/router'
  import { useSvelteFlow } from '@xyflow/svelte'
  import { useConvexClient, useQuery } from 'convex-svelte'
  import { api } from '~convex/api'
  import type { Id } from '~convex/dataModel'

  const convex = useConvexClient()
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

  const graphId = route.params.graphId as Id<'graphs'>

  const graphTitle = useQuery(api.graphs.getGraphTitle, { graphId })
  const graph = useQuery(api.graphs.getGraph, { graphId })
  const categories = useQuery(api.graphs.listCategories, () => ({}))
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
      graph: graph.data,
      readonly: false,
      tooltipsEnabled: canvasState.tooltipsEnabled,
    }),
  )
  const filteredNodes = $derived.by(() => {
    return filterGraphNodes(graph.data?.nodes ?? [], searchTerm)
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
    await Promise.all(
      moves.map((move) =>
        convex.mutation(api.graphs.updateNodePosition, {
          nodeId: move.nodeId as Id<'nodes'>,
          position: move[direction],
        }),
      ),
    )
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
    await convex.mutation(api.graphs.deleteNode, { nodeId })
    clearSelection()
  }

  async function deleteEdgeById(edgeId: Id<'edges'>) {
    await convex.mutation(api.graphs.deleteEdge, { edgeId })
    clearSelection()
  }

  async function createNode(input: {
    label: string
    categoryLabel: string
    infoSource?: string
    note?: string
  }) {
    if (!input.label.trim()) return

    let currentNodeId = await convex.mutation(api.graphs.createNode, {
      graphId,
      label: input.label,
      categoryLabel: input.categoryLabel,
      infoSource: input.infoSource,
      note: input.note,
    })

    selectNode(currentNodeId)
    history.record({
      undo: async () => {
        await deleteNodeById(currentNodeId)
      },
      redo: async () => {
        currentNodeId = await convex.mutation(api.graphs.createNode, {
          graphId,
          ...input,
        })
        selectNode(currentNodeId)
      },
    })
  }

  async function createEdge(input: EdgeForm) {
    if (!input.source || !input.target) return
    if (input.source === input.target) return

    let currentEdgeId = await convex.mutation(api.graphs.createEdge, {
      graphId,
      source: input.source,
      target: input.target,
      label: input.label,
      directed: input.directed,
      infoSource: input.infoSource,
      note: input.note,
    })

    selectEdge(currentEdgeId)
    history.record({
      undo: async () => {
        await deleteEdgeById(currentEdgeId)
      },
      redo: async () => {
        currentEdgeId = await convex.mutation(api.graphs.createEdge, {
          graphId,
          source: input.source as Id<'nodes'>,
          target: input.target as Id<'nodes'>,
          label: input.label,
          directed: input.directed,
          infoSource: input.infoSource,
          note: input.note,
        })
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

<Header title={graphTitle.data ?? undefined} />

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
      nodes={graph.data?.nodes ?? []}
      bind:nodeForm
      bind:edgeForm
      onsubmitNode={() => {
        const input = toNodeInput(
          nodeForm,
          categories.data?.[0]?.label || '未分類',
        )
        void createNode(input)
        nodeForm = createEmptyNodeForm(categories.data?.[0]?.label ?? '')
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
      {#each categories.data ?? [] as category (category._id)}
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
/>
