import type { CanvasSelectedItem } from '@/lib/features/canvas/types'
import { useOnSelectionChange } from '@xyflow/svelte'
import { getContext, setContext } from 'svelte'

export interface CanvasState {
  selectedItem: CanvasSelectedItem | null
  selectedItems: CanvasSelectedItem[]
  tooltipsEnabled: boolean
}

class CanvasStateClass implements CanvasState {
  selectedItem: CanvasSelectedItem | null = $state(null)
  selectedItems: CanvasSelectedItem[] = $state([])

  tooltipsEnabled = $state(true)

  clearSelections() {
    this.selectedItem = null
    this.selectedItems = []
  }

  constructor() {
    useOnSelectionChange(({ nodes, edges }) => {
      if (nodes.length + edges.length === 1) {
        this.selectedItems = []
        if (nodes.length === 1)
          this.selectedItem = { id: nodes[0].id, type: 'graph-node' }
        if (edges.length === 1)
          this.selectedItem = { id: edges[0].id, type: 'graph-edge' }
        return
      }

      this.selectedItem = null
      this.selectedItems =
        nodes.length > 1
          ? nodes.map((node) => ({ id: node.id, type: 'graph-node' }))
          : []

      if (edges.length > 0) {
        this.selectedItem = null
      }
    })
  }
}

const canvasContextKey = '$_canvas_state'

export function getCanvasContext(key = canvasContextKey): CanvasStateClass {
  return getContext(key)
}

export function setCanvasContext(key = canvasContextKey) {
  const canvasState = new CanvasStateClass()
  return setContext(key, canvasState)
}
