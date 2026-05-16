import type { CanvasSelectedItem } from '@/lib/features/canvas/types'

export const canvasState = $state({
  selectedItem: null as CanvasSelectedItem | null,
  selectedNodeIds: [] as string[],
  selectionMode: false,
  tooltipsEnabled: true,
})
