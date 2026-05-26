import type { FunctionReturnType } from 'convex/server'
import { api } from '~convex/api'
import type { CanvasSelectedItem } from '../../canvas/types'

export type GraphQueryData = NonNullable<
  FunctionReturnType<typeof api.graphs.getGraph>
>

export type GraphNode = GraphQueryData['nodes'][number]

export function getSelectedGraphNode(
  graph: GraphQueryData | null | undefined,
  selectedItem: CanvasSelectedItem | null,
) {
  return selectedItem?.type === 'graph-node'
    ? graph?.nodes.find((node) => node._id === selectedItem.id)
    : undefined
}

export type GraphEdge = GraphQueryData['edges'][number]

export function getSelectedGraphEdge(
  graph: GraphQueryData | null | undefined,
  selectedItem: CanvasSelectedItem | null,
) {
  return selectedItem?.type === 'graph-edge'
    ? graph?.edges.find((edge) => edge._id === selectedItem.id)
    : undefined
}

export function filterGraphNodes(
  nodes: GraphQueryData['nodes'],
  searchTerm: string,
) {
  const term = searchTerm.trim().toLocaleLowerCase()

  if (!term) return nodes

  return nodes.filter((node) =>
    `${node.label} ${node.categoryLabel}`.toLocaleLowerCase().includes(term),
  )
}
