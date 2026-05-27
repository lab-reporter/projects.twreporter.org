<script lang="ts">
  import { SvelteFlow, useSvelteFlow } from '@xyflow/svelte'
  import '@xyflow/svelte/dist/style.css'
  import type {
    FlowEdge,
    FlowNode,
    NodePosition,
    NodePositionMove,
  } from '../../features/canvas/types'
  import GraphEdge from './GraphEdge.svelte'
  import GraphNode from './GraphNode.svelte'
  import { useHistory } from '@/lib/features/use-history.svelte'

  let {
    nodes = $bindable(),
    edges = $bindable(),
    readonly = false,
    onMoveNodes,
    onUndoMoveNodes,
  }: {
    nodes: FlowNode[]
    edges: FlowEdge[]
    readonly?: boolean
    onMoveNodes?: (moves: NodePositionMove[]) => Promise<void>
    onUndoMoveNodes?: (moves: NodePositionMove[]) => Promise<void>
  } = $props()

  const history = useHistory()
  const { getNodes } = useSvelteFlow<FlowNode, FlowEdge>()

  let dragStartPositions = new Map<string, NodePosition>()

  function rememberDragStart() {
    dragStartPositions = new Map(
      getNodes().map((node) => [
        node.id,
        { x: node.position.x, y: node.position.y },
      ]),
    )
  }

  function handleNodeDragStop() {
    if (readonly || !onMoveNodes) return

    const moves = getNodes()
      .map((node) => {
        const from = dragStartPositions.get(node.id)

        if (!from) return null

        const to = { x: node.position.x, y: node.position.y }

        if (from.x === to.x && from.y === to.y) return null

        return { nodeId: node.id, from, to }
      })
      .filter((move): move is NodePositionMove => move !== null)

    dragStartPositions = new Map()

    if (moves.length === 0) return

    onMoveNodes(moves)

    history.record({
      undo: async () => {
        await onUndoMoveNodes?.(moves)
      },
      redo: () => onMoveNodes(moves),
    })
  }
</script>

<div class="canvas-shell">
  <div class="canvas-surface">
    <SvelteFlow
      bind:nodes
      bind:edges
      nodeTypes={{ 'graph-node': GraphNode }}
      edgeTypes={{ 'graph-edge': GraphEdge }}
      fitView
      fitViewOptions={{ padding: 0.22 }}
      minZoom={0.4}
      maxZoom={1.75}
      nodeDragThreshold={4}
      elementsSelectable={!readonly}
      selectionOnDrag={!readonly}
      panOnDrag={!readonly}
      nodesDraggable={!readonly}
      nodesConnectable={false}
      zoomOnScroll={!readonly}
      zoomOnPinch={!readonly}
      panOnScroll={!readonly}
      onnodedragstart={() => {
        if (!readonly) rememberDragStart()
      }}
      onnodedragstop={() => {
        handleNodeDragStop()
      }}
      zIndexMode="manual"
      preventScrolling={!readonly}
    ></SvelteFlow>
  </div>
</div>

<style>
  .canvas-shell {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    box-sizing: border-box;
    background: transparent;
  }

  .canvas-surface {
    width: 100%;
    box-sizing: border-box;
    min-width: 0;
    min-height: 0;
    height: 100%;
    padding: 0 14px 14px 0;
  }

  .canvas-surface :global(.svelte-flow) {
    border-top-right-radius: 18px;
    background: transparent;
  }

  .canvas-surface :global(.svelte-flow__renderer) {
    cursor: grab;
  }

  .canvas-surface :global(.svelte-flow__renderer:active) {
    cursor: grabbing;
  }

  .canvas-surface :global(.svelte-flow__viewport) {
    background: transparent;
  }

  .canvas-surface :global(.svelte-flow__attribution) {
    display: none;
  }
</style>
