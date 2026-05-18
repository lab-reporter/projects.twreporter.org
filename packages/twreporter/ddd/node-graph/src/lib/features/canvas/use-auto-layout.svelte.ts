import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force'
import type { FlowEdge, FlowNode, NodePositionMove } from './types'
import { useHistory } from '../use-history.svelte'

const NODE_WIDTH = 240
const NODE_HEIGHT = 118
const LINK_DISTANCE = 230
const COLLISION_RADIUS = 150
const SIMULATION_TICKS = 260

type LayoutNode = {
  id: string
  x: number
  y: number
}

type LayoutLink = {
  source: string
  target: string
}

type AutoLayoutOptions = {
  getNodes: () => FlowNode[]
  getEdges: () => FlowEdge[]
  onMoveNodes: (moves: NodePositionMove[]) => Promise<void>
  onUndoMoveNodes?: (moves: NodePositionMove[]) => Promise<void>
  onAfterLayout?: () => void
}

function getCentroid(points: { x: number; y: number }[]) {
  if (points.length === 0) return { x: 0, y: 0 }

  return points.reduce(
    (centroid, point) => ({
      x: centroid.x + point.x / points.length,
      y: centroid.y + point.y / points.length,
    }),
    { x: 0, y: 0 },
  )
}

function roundPosition(position: { x: number; y: number }) {
  return {
    x: Math.round(position.x),
    y: Math.round(position.y),
  }
}

function buildAutoLayoutMoves(nodes: FlowNode[], edges: FlowEdge[]) {
  const originalCenters = nodes.map((node) => ({
    id: node.id,
    x: node.position.x + NODE_WIDTH / 2,
    y: node.position.y + NODE_HEIGHT / 2,
  }))
  const originalCentroid = getCentroid(originalCenters)

  const layoutNodes: LayoutNode[] = originalCenters.map((node) => ({
    id: node.id,
    x: node.x,
    y: node.y,
  }))
  const nodeIds = new Set(layoutNodes.map((node) => node.id))
  const layoutLinks: LayoutLink[] = edges
    .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
    .map((edge) => ({
      source: edge.source,
      target: edge.target,
    }))

  forceSimulation(layoutNodes)
    .force(
      'link',
      forceLink<LayoutNode, LayoutLink>(layoutLinks)
        .id((node) => node.id)
        .distance(LINK_DISTANCE)
        .strength(0.72),
    )
    .force('charge', forceManyBody().strength(-950))
    .force('collide', forceCollide(COLLISION_RADIUS).strength(0.92))
    .force('center', forceCenter(originalCentroid.x, originalCentroid.y))
    .stop()
    .tick(SIMULATION_TICKS)

  const layoutCentroid = getCentroid(layoutNodes)
  const offset = {
    x: originalCentroid.x - layoutCentroid.x,
    y: originalCentroid.y - layoutCentroid.y,
  }
  const nodeById = new Map(nodes.map((node) => [node.id, node]))

  return layoutNodes
    .map((node) => {
      const flowNode = nodeById.get(node.id)

      if (!flowNode) return null

      const from = roundPosition(flowNode.position)
      const to = roundPosition({
        x: node.x + offset.x - NODE_WIDTH / 2,
        y: node.y + offset.y - NODE_HEIGHT / 2,
      })

      if (from.x === to.x && from.y === to.y) return null

      return {
        nodeId: flowNode.id,
        from,
        to,
      }
    })
    .filter((move): move is NodePositionMove => move !== null)
}

export function useAutoLayout(options: AutoLayoutOptions) {
  const history = useHistory()
  let busy = $state(false)

  async function applyAutoLayout() {
    if (busy) return

    const nodes = options.getNodes()

    if (nodes.length < 2) return

    const moves = buildAutoLayoutMoves(nodes, options.getEdges())

    if (moves.length === 0) return

    busy = true

    try {
      await options.onMoveNodes(moves)
      options.onAfterLayout?.()

      history.record({
        undo: async () => {
          await options.onUndoMoveNodes?.(moves)
          options.onAfterLayout?.()
        },
        redo: async () => {
          await options.onMoveNodes(moves)
          options.onAfterLayout?.()
        },
      })
    } finally {
      busy = false
    }
  }

  return {
    get busy() {
      return busy
    },
    applyAutoLayout,
  }
}
