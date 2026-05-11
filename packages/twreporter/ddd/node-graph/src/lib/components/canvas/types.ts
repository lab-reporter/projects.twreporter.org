import type { Edge, Node } from '@xyflow/svelte'

export type GraphNodeData = {
  label: string
  categoryLabel: string
  categoryColor: string
  note?: string
  infoSource?: string
  expanded: boolean
}

export type GraphEdgeData = {
  relationLabel: string
  sourceLabel: string
  targetLabel: string
  note?: string
  infoSource?: string
  directed: boolean
}

export type FlowNode = Node<GraphNodeData, 'graph-node'>
export type FlowEdge = Edge<GraphEdgeData, 'graph-edge'>
