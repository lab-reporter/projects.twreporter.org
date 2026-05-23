<script lang="ts">
  import { canvasState } from '@/lib/components/canvas/CanvasState.svelte'
  import Sidebar from '@/lib/components/ui/Sidebar.svelte'
  import { buildGraphFlow } from '@/lib/features/canvas/adapter'
  import type { NodePositionMove } from '@/lib/features/canvas/types'
  import {
    filterGraphNodes,
    getSelectedGraphEdge,
    getSelectedGraphNode,
    removeSelectedNodeId,
  } from '@/lib/features/editor/graph/flow'
  import {
    createEdgeFormFromEdge,
    createEmptyDesignForm,
    createEmptyEdgeForm,
    createEmptyNodeForm,
    createNodeFormFromNode,
    toEdgeInput,
    toNodeInput,
    type EdgeDetails,
    type EdgeForm,
    type NodeForm,
  } from '@/lib/features/editor/graph/form'
  import {
    getEdgeSnapshot,
    getNodeDeleteSnapshot,
    getNodeSnapshot,
  } from '@/lib/features/editor/snapshots'
  import { useConvexClient, useQuery } from 'convex-svelte'
  import { api } from '~convex/api'
  import type { Id } from '~convex/dataModel'
  import Canvas from '../../../../lib/components/canvas/Canvas.svelte'
  import Header from '../../../../lib/components/editor/Header.svelte'
  import GraphDesignsTab from '../../../../lib/components/editor/graph/GraphDesignsTab.svelte'
  import GraphNodesAndEdgesTab from '../../../../lib/components/editor/graph/GraphNodesAndEdgesTab.svelte'
  import GraphSearchTab from '../../../../lib/components/editor/graph/GraphSearchTab.svelte'
  import GraphTopBar from '../../../../lib/components/editor/graph/GraphTopBar.svelte'
  import TabContent from '../../../../lib/components/ui/tabs/TabContent.svelte'
  import { useHistory } from '../../../../lib/features/use-history.svelte'
  import { useAutoLayout } from '../../../../lib/features/canvas/use-auto-layout.svelte'
  import { navigate, route } from '../../../router'

  const convex = useConvexClient()
  const history = useHistory()
  const autoLayout = useAutoLayout({
    getNodes: () => flow.nodes,
    getEdges: () => flow.edges,
    onMoveNodes: (moves) => persistNodeMoves(moves, 'to'),
    onUndoMoveNodes: (moves) => persistNodeMoves(moves, 'from'),
  })

  const graphId = route.params.graphId as Id<'graphs'>

  const graphTitle = useQuery(api.graphs.getGraphTitle, { graphId })
  const graph = useQuery(api.graphs.getGraph, { graphId })
  const categories = useQuery(api.graphs.listCategories, () => ({}))
  const designs = useQuery(api.designs.listDesignsForGraph, { graphId })

  let creatingDesign = $state(false)
  let activeSidebarTab = $state('details')
  let nodeForm = $state(createEmptyNodeForm())
  let edgeForm = $state(createEmptyEdgeForm())
  let searchTerm = $state('')
  let designForm = $state(createEmptyDesignForm())
  let hydratedSelectionKey = $state<string | null>(null)

  const sidebarTabs = {
    details: 'details',
    search: 'search',
    design: 'design',
  }

  const flow = $derived(
    buildGraphFlow({
      graph: graph.data,
      readonly: false,
      selectedItem: canvasState.selectedItem,
      selectedNodeIds: canvasState.selectedNodeIds,
      tooltipsEnabled: canvasState.tooltipsEnabled,
    }),
  )
  const selectedNode = $derived.by(() => {
    return getSelectedGraphNode(graph.data, canvasState.selectedItem)
  })
  const selectedEdge = $derived.by(() => {
    return getSelectedGraphEdge(graph.data, canvasState.selectedItem)
  })
  const filteredNodes = $derived.by(() => {
    return filterGraphNodes(graph.data?.nodes ?? [], searchTerm)
  })

  $effect(() => {
    const selectedItem = canvasState.selectedItem

    if (!selectedItem) {
      hydratedSelectionKey = 'none'
      return
    }

    const key = `${selectedItem.type}:${selectedItem.id}`

    if (hydratedSelectionKey === key) return

    if (selectedNode) {
      hydratedSelectionKey = key
      nodeForm = createNodeFormFromNode(selectedNode)
    } else if (selectedEdge) {
      hydratedSelectionKey = key
      edgeForm = createEdgeFormFromEdge(selectedEdge)
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

  function selectNode(nodeId: Id<'nodes'>) {
    canvasState.selectedItem = { type: 'graph-node', id: nodeId }
  }

  function selectEdge(edgeId: Id<'edges'>) {
    canvasState.selectedItem = { type: 'graph-edge', id: edgeId }
  }

  function clearSelection(nodeId?: Id<'nodes'>) {
    canvasState.selectedItem = null

    if (nodeId) {
      canvasState.selectedNodeIds = removeSelectedNodeId(
        canvasState.selectedNodeIds,
        nodeId,
      )
    }
  }

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
    clearSelection(nodeId)
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
          selectNode(restored.nodeId)
        },
        redo: async () => {
          await deleteNodeById(currentNodeId)
        },
      })
    }
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
          selectEdge(currentEdgeId)
        },
        redo: async () => {
          await deleteEdgeById(currentEdgeId)
        },
      })
    }
  }
</script>

<Header title={graphTitle.data ?? undefined} />

<GraphTopBar
  autoLayoutDisabled={autoLayout.busy || flow.nodes.length < 2}
  onAutoLayout={() => void autoLayout.applyAutoLayout()}
/>

<Sidebar
  bind:activeTabValue={activeSidebarTab}
  tabs={[
    { label: '編輯與詳情', value: sidebarTabs.details },
    { label: '資料搜尋', value: sidebarTabs.search },
    { label: '設計', value: sidebarTabs.design },
  ]}
>
  <TabContent value={sidebarTabs.details}>
    <GraphNodesAndEdgesTab
      {selectedNode}
      {selectedEdge}
      nodes={graph.data?.nodes ?? []}
      bind:nodeForm
      bind:edgeForm
      onsubmitNode={() => {
        const input = toNodeInput(
          nodeForm,
          categories.data?.[0]?.label || '未分類',
        )

        if (selectedNode) {
          if (!input.label.trim()) return
          const nodeId = selectedNode._id
          const previous = getNodeSnapshot(graph.data, nodeId)

          void (async () => {
            await updateNodeDetails(nodeId, input)

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
          })()
        } else {
          void createNode(input)
          nodeForm = createEmptyNodeForm(categories.data?.[0]?.label ?? '')
        }
      }}
      onsubmitEdge={() => {
        const input = toEdgeInput(edgeForm)

        if (selectedEdge) {
          const edgeId = selectedEdge._id
          const previous = getEdgeSnapshot(graph.data, edgeId)

          void (async () => {
            await updateEdgeDetails(edgeId, input)

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
          })()
        } else {
          void createEdge(input)
          edgeForm = createEmptyEdgeForm()
        }
      }}
      ondeleteNode={(nodeId) => void deleteNode(nodeId)}
      ondeleteEdge={(edgeId) => void deleteEdge(edgeId)}
      ontoggleNodeExpanded={() => {
        if (canvasState.selectedItem?.type !== 'graph-node') return

        const node = graph.data?.nodes.find(
          (currentNode) => currentNode._id === canvasState.selectedItem?.id,
        )

        if (!node) return

        void convex.mutation(api.graphs.setNodeExpanded, {
          nodeId: node._id,
          expanded: !node.expanded,
        })
      }}
    />
  </TabContent>

  <TabContent value={sidebarTabs.search}>
    <GraphSearchTab
      bind:searchTerm
      nodes={filteredNodes}
      onselect={(nodeId) => {
        canvasState.selectedItem = { type: 'graph-node', id: nodeId }
        activeSidebarTab = sidebarTabs.details
      }}
    />
  </TabContent>

  <TabContent value={sidebarTabs.design}>
    <GraphDesignsTab
      bind:designForm
      designs={designs.data ?? []}
      {creatingDesign}
      onsubmit={() => {
        if (creatingDesign) return
        const title = designForm.title.trim()

        if (!title) return

        creatingDesign = true

        void (async () => {
          try {
            const designId = await convex.mutation(api.designs.createDesign, {
              graphId,
              title,
              description: designForm.description.trim() || undefined,
            })

            if (canvasState.selectedNodeIds.length > 0) {
              await convex.mutation(api.designs.addNodesToDesign, {
                designId,
                nodeIds: canvasState.selectedNodeIds as Id<'nodes'>[],
              })
            }

            navigate('/graphs/:graphId/designs/:designId', {
              params: {
                graphId,
                designId,
              },
            })
          } finally {
            creatingDesign = false
          }
        })()
      }}
      onopen={(designId) => {
        navigate('/graphs/:graphId/designs/:designId', {
          params: {
            graphId,
            designId,
          },
        })
      }}
    />
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
