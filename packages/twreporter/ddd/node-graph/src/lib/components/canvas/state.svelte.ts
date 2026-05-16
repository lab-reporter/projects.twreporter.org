import type { FlowEdge, FlowNode } from './types'

export const canvasState = $state({
  selectedItem: null as FlowNode | FlowEdge | null,
  selectedNodeIds: [] as string[],
  selectionMode: false,
  tooltipsEnabled: true,
})
