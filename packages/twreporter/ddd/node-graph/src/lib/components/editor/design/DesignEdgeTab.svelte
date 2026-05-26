<script lang="ts">
  import { DesignApi } from '@/lib/apis/design.svelte'
  import { useConvexOptimisticUpdateValue } from '@/lib/features/use-convex-field.svelte'
  import { normalizeEdgeStyle } from '@/lib/utils/canvas'
  import { getCanvasContext } from '../../canvas/CanvasState.svelte'
  import SidebarColorInput from '../../ui/sidebar/SidebarColorInput.svelte'
  import SidebarSection from '../../ui/sidebar/SidebarSection.svelte'
  import type { EdgeStyle } from '../types'
  import type { Id } from '~convex/dataModel'

  const canvasState = getCanvasContext()

  const designApi = new DesignApi()

  const designData = $derived(designApi.designData)

  const selectedEdgeStyle = $derived.by(() => {
    const data = designData.data

    if (!data || canvasState.selectedItem?.type !== 'graph-edge') {
      return undefined
    }

    return normalizeEdgeStyle(
      data.designEdges.find(
        (designEdge) => designEdge.edgeId === canvasState.selectedItem?.id,
      )?.edgeStyle,
    )
  })

  function updateEdgeStyle(patch: Partial<EdgeStyle>) {
    if (canvasState.selectedItem?.type !== 'graph-edge') {
      return
    }

    designApi.updateDesignEdgeStyle({
      edgeId: canvasState.selectedItem.id as Id<'edges'>,
      patch,
    })
  }

  const fields = {
    strokeColor: useConvexOptimisticUpdateValue(
      () => selectedEdgeStyle?.strokeColor,
      (strokeColor) => updateEdgeStyle({ strokeColor }),
    ),
    arrowColor: useConvexOptimisticUpdateValue(
      () => selectedEdgeStyle?.arrowColor,
      (arrowColor) => updateEdgeStyle({ arrowColor }),
    ),
    labelBackgroundColor: useConvexOptimisticUpdateValue(
      () => selectedEdgeStyle?.labelBackgroundColor,
      (labelBackgroundColor) => updateEdgeStyle({ labelBackgroundColor }),
    ),
    labelTextColor: useConvexOptimisticUpdateValue(
      () => selectedEdgeStyle?.labelTextColor,
      (labelTextColor) => updateEdgeStyle({ labelTextColor }),
    ),
  }
</script>

<SidebarSection title="線段">
  <SidebarColorInput label="線段" bind:value={fields.strokeColor.value} />
  <SidebarColorInput label="箭頭" bind:value={fields.arrowColor.value} />
  <SidebarColorInput
    label="標籤背景"
    bind:value={fields.labelBackgroundColor.value}
  />
  <SidebarColorInput
    label="標籤文字"
    bind:value={fields.labelTextColor.value}
  />
</SidebarSection>
