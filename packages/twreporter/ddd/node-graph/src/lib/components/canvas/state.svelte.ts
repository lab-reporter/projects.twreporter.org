import type { FlowEdge, FlowNode } from '@/lib/features/canvas/types'

export const canvasState = $state({
  selectedItem: null as FlowNode | FlowEdge | null,
  selectedNodeIds: [] as string[],
  selectionMode: false,
  tooltipsEnabled: true,
})
