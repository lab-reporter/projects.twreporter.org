import type { CanvasSelectedItem } from '@/lib/features/canvas/types'
import {
  getIncomers,
  getOutgoers,
  useOnSelectionChange,
  useSvelteFlow,
} from '@xyflow/svelte'
import { getContext, setContext } from 'svelte'

export interface CanvasState {
  selectedItem: CanvasSelectedItem | null
  selectedItems: CanvasSelectedItem[]
  tooltipsEnabled: boolean
}

class CanvasStateClass implements CanvasState {
  selectedItem: CanvasSelectedItem | null = $state(null)
  selectedItems: CanvasSelectedItem[] = $state([])

  selectedItemConnectedNodeIds = $derived.by(() => {
    if (this.selectedItem?.type !== 'graph-node') return null

    const { getEdges, getNodes } = useSvelteFlow()
    const nodes = getNodes()
    const edges = getEdges()

    return [
      ...getOutgoers({ id: this.selectedItem?.id }, nodes, edges).map(
        (node) => node.id,
      ),
      ...getIncomers({ id: this.selectedItem?.id }, nodes, edges).map(
        (node) => node.id,
      ),
    ]
  })
  selectedItemconnectedEdgeIds = $derived.by(() => {
    if (this.selectedItem?.type !== 'graph-node') return null

    const nodeId = this.selectedItem.id
    const { getEdges } = useSvelteFlow()

    const edges = getEdges()
    return edges
      .filter((edge) => edge.target === nodeId || edge.source === nodeId)
      .map((edge) => edge.id)
  })
  fadeNotConnectedNodes: boolean = $state(false)

  tooltipsEnabled = $state(true)

  clearSelections() {
    this.selectedItem = null
    this.selectedItems = []
  }

  constructor(options?: { fadeNotConnectedNodes?: boolean }) {
    if (options?.fadeNotConnectedNodes) {
      this.fadeNotConnectedNodes = options.fadeNotConnectedNodes
    }

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

export function setCanvasContext(
  key = canvasContextKey,
  options?: { fadeNotConnectedNodes?: boolean },
) {
  const canvasState = new CanvasStateClass(options)
  return setContext(key, canvasState)
}
