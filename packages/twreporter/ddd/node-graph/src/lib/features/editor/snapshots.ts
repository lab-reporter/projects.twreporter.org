import type { Doc, Id } from '~convex/dataModel'

export const restoredNodeEndpoint = '__RESTORED_NODE__' as const

type GraphNode = Pick<
  Doc<'nodes'>,
  | '_id'
  | 'label'
  | 'infoSource'
  | 'note'
  | 'position'
  | 'expanded'
  | 'imageUrl'
> & {
  categoryLabel: Doc<'categories'>['label']
}

type GraphEdge = Pick<
  Doc<'edges'>,
  '_id' | 'source' | 'target' | 'label' | 'directed' | 'infoSource' | 'note'
>

export type SnapshotGraph = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export type NodeSnapshot = Omit<GraphNode, '_id'> & {
  position: Doc<'nodes'>['position']
}

export type RestoredNodeEndpoint = typeof restoredNodeEndpoint
export type EdgeSnapshotEndpoint = Id<'nodes'>

export type EdgeSnapshot = {
  source: EdgeSnapshotEndpoint
  target: EdgeSnapshotEndpoint
  label?: string
  directed: boolean
  infoSource?: string
  note?: string
}

export type NodeDeleteSnapshot = {
  node: NodeSnapshot
  edges: Array<
    Omit<EdgeSnapshot, 'source' | 'target'> & {
      source: EdgeSnapshotEndpoint | RestoredNodeEndpoint
      target: EdgeSnapshotEndpoint | RestoredNodeEndpoint
    }
  >
}

export function getNodeSnapshot(
  graph: SnapshotGraph | null | undefined,
  nodeId: Id<'nodes'>,
): NodeSnapshot | null {
  const node = graph?.nodes.find((currentNode) => currentNode._id === nodeId)

  if (!node) return null

  return {
    label: node.label,
    categoryLabel: node.categoryLabel,
    infoSource: node.infoSource,
    note: node.note,
    position: node.position,
    expanded: node.expanded,
    imageUrl: node.imageUrl,
  }
}

export function getEdgeSnapshot(
  graph: SnapshotGraph | null | undefined,
  edgeId: Id<'edges'>,
): EdgeSnapshot | null {
  const edge = graph?.edges.find((currentEdge) => currentEdge._id === edgeId)

  if (!edge) return null

  return {
    source: edge.source,
    target: edge.target,
    label: edge.label,
    directed: edge.directed,
    infoSource: edge.infoSource,
    note: edge.note,
  }
}

export function getNodeDeleteSnapshot(
  graph: SnapshotGraph | null | undefined,
  nodeId: Id<'nodes'>,
): NodeDeleteSnapshot | null {
  const node = getNodeSnapshot(graph, nodeId)

  if (!node) return null

  const edges =
    graph?.edges
      .filter((edge) => edge.source === nodeId || edge.target === nodeId)
      .map((edge) => ({
        source: edge.source === nodeId ? restoredNodeEndpoint : edge.source,
        target: edge.target === nodeId ? restoredNodeEndpoint : edge.target,
        label: edge.label,
        directed: edge.directed,
        infoSource: edge.infoSource,
        note: edge.note,
      })) ?? []

  return { node, edges }
}
