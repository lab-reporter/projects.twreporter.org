import type { DesignQueryData } from '@/lib/apis/convex'
import type { CanvasState } from '@/lib/components/canvas/CanvasState.svelte'
import { Position } from '@xyflow/svelte'
import type { ViewportKey } from '../../constants/viewports'
import { normalizeEdgeStyle, normalizeNodeStyle } from '../../utils/canvas'
import type { GraphQueryData } from '../editor/graph/flow'
import type { FlowEdge, FlowNode, NodePosition } from './types'

function resolvePosition(input: {
  graph: DesignQueryData
  nodeId: string
  canonicalPosition: NodePosition
  activeLayoutKey: ViewportKey
}) {
  const { graph, nodeId, canonicalPosition, activeLayoutKey } = input
  const desktopPosition = graph.positionsByLayoutKey.desktop?.[nodeId]

  if (activeLayoutKey === 'desktop') {
    return desktopPosition ?? canonicalPosition
  }

  const mobilePosition = graph.positionsByLayoutKey.mobile?.[nodeId]

  if (activeLayoutKey === 'mobile') {
    return mobilePosition ?? desktopPosition ?? canonicalPosition
  }

  return (
    graph.positionsByLayoutKey.social?.[nodeId] ??
    mobilePosition ??
    desktopPosition ??
    canonicalPosition
  )
}

export function buildDesignFlow(input: {
  canvasState?: CanvasState
  graph: DesignQueryData | null | undefined
  readonly: boolean
  activeLayoutKey: ViewportKey
  tooltipsEnabled: boolean
}) {
  const { graph, readonly, activeLayoutKey, tooltipsEnabled } = input

  if (!graph) return { nodes: [], edges: [] }

  const designNodesByNodeId = new Map(
    graph.designNodes.map((designNode) => [designNode.nodeId, designNode]),
  )
  const designEdgesByEdgeId = new Map(
    graph.designEdges.map((designEdge) => [designEdge.edgeId, designEdge]),
  )

  const nodes: FlowNode[] = graph.nodes.map((node) => {
    const nodeStyle = normalizeNodeStyle(
      designNodesByNodeId.get(node._id)?.nodeStyle,
    )

    return {
      id: node._id,
      type: 'graph-node',
      selected:
        node._id === input.canvasState?.selectedItem?.id ||
        input.canvasState?.selectedItems.map((i) => i.id).includes(node._id),
      position: resolvePosition({
        graph,
        nodeId: node._id,
        canonicalPosition: node.position,
        activeLayoutKey,
      }),
      data: {
        label: node.label,
        categoryLabel: node.categoryLabel,
        categoryColor: node.categoryColor,
        note: node.note,
        infoSource: node.infoSource,
        expanded: nodeStyle.descriptionDefaultOpen ?? node.expanded,
        backgroundColor: nodeStyle.backgroundColor,
        borderColor: nodeStyle.borderColor,
        textColor: nodeStyle.textColor,
        descriptionBackgroundColor: nodeStyle.descriptionBackgroundColor,
        descriptionTextColor: nodeStyle.descriptionTextColor,
        tooltipsEnabled,
        imageUrl: node.imageUrl,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      draggable: !readonly,
      dragHandle: '.graph-node',
    }
  })

  const edges: FlowEdge[] = graph.edges.map((edge) => {
    const edgeStyle = normalizeEdgeStyle(
      designEdgesByEdgeId.get(edge._id)?.edgeStyle,
    )

    return {
      id: edge._id,
      type: 'graph-edge',
      source: edge.source,
      target: edge.target,
      selected: edge._id === input.canvasState?.selectedItem?.id,
      data: {
        relationLabel: edge.label ?? '',
        sourceLabel: edge.sourceLabel,
        targetLabel: edge.targetLabel,
        note: edge.note,
        infoSource: edge.infoSource,
        directed: edge.directed,
        strokeColor: edgeStyle.strokeColor,
        arrowColor: edgeStyle.arrowColor,
        labelBackgroundColor: edgeStyle.labelBackgroundColor,
        labelTextColor: edgeStyle.labelTextColor,
        tooltipsEnabled,
      },
      label: edge.label,
      selectable: !readonly,
      focusable: !readonly,
    }
  })

  return { nodes, edges }
}

export function buildGraphFlow(input: {
  canvasState?: CanvasState
  graph: GraphQueryData | null | undefined
  readonly: boolean
  tooltipsEnabled: boolean
}) {
  const { graph, readonly, tooltipsEnabled } = input

  if (!graph) return { nodes: [], edges: [] }

  const nodes: FlowNode[] = graph.nodes.map((node) => ({
    id: node._id,
    type: 'graph-node',
    position: node.position,
    data: {
      label: node.label,
      categoryLabel: node.categoryLabel,
      categoryColor: node.categoryColor,
      note: node.note,
      infoSource: node.infoSource,
      expanded: node.expanded,
      tooltipsEnabled,
      imageUrl: node.imageUrl,
    },
    selected:
      node._id === input.canvasState?.selectedItem?.id ||
      input.canvasState?.selectedItems.map((i) => i.id).includes(node._id),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: !readonly,
    selectable: !readonly,
    focusable: !readonly,
    dragHandle: '.graph-node',
  }))

  const edges: FlowEdge[] = graph.edges.map((edge) => ({
    id: edge._id,
    type: 'graph-edge',
    source: edge.source,
    target: edge.target,
    selected: edge._id === input.canvasState?.selectedItem?.id,
    data: {
      relationLabel: edge.label ?? '',
      sourceLabel: edge.sourceLabel,
      targetLabel: edge.targetLabel,
      note: edge.note,
      infoSource: edge.infoSource,
      directed: edge.directed,
      tooltipsEnabled,
    },
    label: edge.label,
    selectable: !readonly,
    focusable: !readonly,
  }))

  return { nodes, edges }
}
