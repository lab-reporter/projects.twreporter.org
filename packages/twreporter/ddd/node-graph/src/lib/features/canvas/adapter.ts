import { Position } from '@xyflow/svelte'
import type { FunctionReturnType } from 'convex/server'
import { api } from '~convex/api'
import type { ViewportKey } from '../../constants/viewports'
import { normalizeEdgeStyle, normalizeNodeStyle } from '../../utils/canvas'
import type { FlowEdge, FlowNode, NodePosition } from './types'

type DesignQueryData = NonNullable<
  FunctionReturnType<typeof api.designs.getDesign>
>

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
  graph: DesignQueryData | null | undefined
  readonly: boolean
  activeLayoutKey: ViewportKey
  selectedItem: FlowEdge | FlowNode | null
  tooltipsEnabled: boolean
}) {
  const { graph, readonly, activeLayoutKey, selectedItem, tooltipsEnabled } =
    input

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
        selected:
          selectedItem?.type === 'graph-node' && selectedItem.id === node._id,
        multiSelected: false,
        tooltipsEnabled,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      draggable: !readonly,
      selectable: false,
      focusable: false,
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
        selected:
          selectedItem?.type === 'graph-edge' && selectedItem.id === edge._id,
        tooltipsEnabled,
      },
      label: edge.label,
      selectable: false,
      focusable: false,
    }
  })

  return { nodes, edges }
}

type GraphQueryData = NonNullable<
  FunctionReturnType<typeof api.graphs.getGraph>
>

export function buildGraphFlow(input: {
  graph: GraphQueryData | null | undefined
  readonly: boolean
  selectedItem: FlowEdge | FlowNode | null
  selectedNodeIds: string[]
  tooltipsEnabled: boolean
}) {
  const { graph, readonly, selectedItem, selectedNodeIds, tooltipsEnabled } =
    input

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
      selected:
        selectedItem?.type === 'graph-node' && selectedItem.id === node._id,
      multiSelected: selectedNodeIds.includes(node._id),
      tooltipsEnabled,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: !readonly,
    selectable: false,
    focusable: false,
    dragHandle: '.graph-node',
  }))

  const edges: FlowEdge[] = graph.edges.map((edge) => ({
    id: edge._id,
    type: 'graph-edge',
    source: edge.source,
    target: edge.target,
    data: {
      relationLabel: edge.label ?? '',
      sourceLabel: edge.sourceLabel,
      targetLabel: edge.targetLabel,
      note: edge.note,
      infoSource: edge.infoSource,
      directed: edge.directed,
      selected:
        selectedItem?.type === 'graph-edge' && selectedItem.id === edge._id,
      tooltipsEnabled,
    },
    label: edge.label,
    selectable: false,
    focusable: false,
  }))

  return { nodes, edges }
}
