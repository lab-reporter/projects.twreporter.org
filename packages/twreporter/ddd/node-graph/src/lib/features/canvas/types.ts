import type { Edge, Node } from '@xyflow/svelte'
import type { Doc } from '~convex/dataModel'

export type NodePosition = Doc<'nodes'>['position']

export type NodePositionMove = {
  nodeId: Doc<'nodes'>['_id']
  from: NodePosition
  to: NodePosition
}

export type GraphNodeData = Pick<
  Doc<'nodes'>,
  'label' | 'note' | 'infoSource' | 'expanded'
> & {
  categoryLabel: Doc<'categories'>['label']
  categoryColor: Doc<'categories'>['color']
  backgroundColor?: NonNullable<
    Doc<'designNodes'>['nodeStyle']
  >['backgroundColor']
  borderColor?: NonNullable<Doc<'designNodes'>['nodeStyle']>['borderColor']
  textColor?: NonNullable<Doc<'designNodes'>['nodeStyle']>['textColor']
  descriptionBackgroundColor?: NonNullable<
    Doc<'designNodes'>['nodeStyle']
  >['descriptionBackgroundColor']
  descriptionTextColor?: NonNullable<
    Doc<'designNodes'>['nodeStyle']
  >['descriptionTextColor']
  tooltipsEnabled?: boolean
}

export type GraphEdgeData = Pick<
  Doc<'edges'>,
  'note' | 'infoSource' | 'directed'
> & {
  relationLabel: NonNullable<Doc<'edges'>['label']>
  sourceLabel: Doc<'nodes'>['label']
  targetLabel: Doc<'nodes'>['label']
  strokeColor?: NonNullable<Doc<'designEdges'>['edgeStyle']>['strokeColor']
  arrowColor?: NonNullable<Doc<'designEdges'>['edgeStyle']>['arrowColor']
  labelBackgroundColor?: NonNullable<
    Doc<'designEdges'>['edgeStyle']
  >['labelBackgroundColor']
  labelTextColor?: NonNullable<
    Doc<'designEdges'>['edgeStyle']
  >['labelTextColor']
  tooltipsEnabled?: boolean
}

export type FlowNode = Node<GraphNodeData, 'graph-node'>
export type FlowEdge = Edge<GraphEdgeData, 'graph-edge'>
export type CanvasSelectedItem =
  | { id: FlowNode['id']; type: FlowNode['type'] }
  | { id: FlowEdge['id']; type: FlowEdge['type'] }
