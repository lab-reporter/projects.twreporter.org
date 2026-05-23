import type { CanvasSelectedItem } from '@/lib/features/canvas/types'
import { getContext, setContext } from 'svelte'

interface CanvasState {
  selectedItem: CanvasSelectedItem | null
  selectedNodeIds: string[]
  selectionMode: boolean
  tooltipsEnabled: boolean
}

class CanvasStateClass implements CanvasState {
  selectedItem: CanvasSelectedItem | null = $state(null)
  selectedNodeIds: string[] = $state([])

  selectionMode = $state(false)
  tooltipsEnabled = $state(true)

  constructor() {
    $effect(() => {
      if (this.selectionMode) {
        this.selectedItem = null
      } else {
        this.selectedNodeIds = [] as string[]
      }
    })
  }
}

const canvasContextKey = '$_canvas_state'

export function getCanvasContext(): CanvasStateClass {
  return getContext(canvasContextKey)
}

export function setCanvasContext() {
  const canvasState = new CanvasStateClass()
  return setContext(canvasContextKey, canvasState)
}
