<script lang="ts">
  import { DesignApi } from '@/lib/apis/design.svelte'
  import { defaultNodeStyle } from '@/lib/constants/styles'
  import { useConvexOptimisticUpdateValue } from '@/lib/features/use-convex-field.svelte'
  import { normalizeNodeStyle } from '@/lib/utils/canvas'
  import { useConvexClient } from 'convex-svelte'
  import { api } from '~convex/api'
  import type { Id } from '~convex/dataModel'
  import { getCanvasContext } from '../../canvas/CanvasState.svelte'
  import MaterialSymbols from '../../icons/MaterialSymbols.svelte'
  import Button from '../../ui/Button.svelte'
  import SidebarCheckboxRow from '../../ui/sidebar/SidebarCheckboxRow.svelte'
  import SidebarColorInput from '../../ui/sidebar/SidebarColorInput.svelte'
  import SidebarSection from '../../ui/sidebar/SidebarSection.svelte'
  import type { NodeStyle } from '../types'

  const canvasState = getCanvasContext()
  const convex = useConvexClient()

  const designApi = new DesignApi()

  const designData = $derived(designApi.designData)

  const selectedRawNodeStyle = $derived.by(() => {
    const data = designData.data

    if (!data || canvasState.selectedItem?.type !== 'graph-node') {
      return undefined
    }

    return data.designNodes.find(
      (designNode) => designNode.nodeId === canvasState.selectedItem?.id,
    )?.nodeStyle
  })

  const selectedNode = $derived.by(() => {
    const data = designData.data

    if (!data || canvasState.selectedItem?.type !== 'graph-node') {
      return undefined
    }

    return data.nodes.find((node) => node._id === canvasState.selectedItem?.id)
  })

  const selectedNodeStyle = $derived(normalizeNodeStyle(selectedRawNodeStyle))

  function updateNodeStyle(patch: Partial<NodeStyle>) {
    if (canvasState.selectedItem?.type !== 'graph-node') {
      return
    }

    designApi.updateDesignNodeStyle({
      nodeId: canvasState.selectedItem.id as Id<'nodes'>,
      patch,
    })
  }

  const fields = {
    backgroundColor: useConvexOptimisticUpdateValue(
      () =>
        selectedRawNodeStyle?.backgroundColor ??
        selectedNode?.categoryColor ??
        defaultNodeStyle.backgroundColor,
      (backgroundColor) => updateNodeStyle({ backgroundColor }),
    ),
    borderColor: useConvexOptimisticUpdateValue(
      () => selectedNodeStyle?.borderColor,
      (borderColor) => updateNodeStyle({ borderColor }),
    ),
    textColor: useConvexOptimisticUpdateValue(
      () => selectedNodeStyle?.textColor,
      (textColor) => updateNodeStyle({ textColor }),
    ),
    descriptionBackgroundColor: useConvexOptimisticUpdateValue(
      () => selectedNodeStyle?.descriptionBackgroundColor,
      (descriptionBackgroundColor) =>
        updateNodeStyle({ descriptionBackgroundColor }),
    ),
    descriptionTextColor: useConvexOptimisticUpdateValue(
      () => selectedNodeStyle?.descriptionTextColor,
      (descriptionTextColor) => updateNodeStyle({ descriptionTextColor }),
    ),
    descriptionDefaultOpen: useConvexOptimisticUpdateValue(
      () => selectedNodeStyle?.descriptionDefaultOpen,
      (descriptionDefaultOpen) => updateNodeStyle({ descriptionDefaultOpen }),
    ),
  }
</script>

<SidebarSection title="節點">
  <SidebarColorInput label="背景" bind:value={fields.backgroundColor.value} />
  <SidebarColorInput label="邊框" bind:value={fields.borderColor.value} />
  <SidebarColorInput label="文字標籤" bind:value={fields.textColor.value} />
  <SidebarColorInput
    label="描述背景"
    bind:value={fields.descriptionBackgroundColor.value}
  />
</SidebarSection>

<SidebarSection title="描述">
  <SidebarCheckboxRow
    label="預設開啟描述"
    bind:checked={fields.descriptionDefaultOpen.value}
  />

  <SidebarColorInput
    label="文字標籤"
    bind:value={fields.descriptionTextColor.value}
  />
</SidebarSection>

<SidebarSection>
  <Button
    variant="outlined"
    onclick={async () => {
      if (designApi.canvasState.selectedItem?.type !== 'graph-node') return

      await convex.mutation(api.designs.updateDesignNodeStylesToSameCategory, {
        designId: designApi.params.designId,
        nodeId: designApi.canvasState.selectedItem.id as Id<'nodes'>,
        style: {
          backgroundColor:
            fields.backgroundColor.value ?? defaultNodeStyle.backgroundColor,
          borderColor: fields.borderColor.value ?? defaultNodeStyle.borderColor,
          descriptionBackgroundColor:
            fields.descriptionBackgroundColor.value ??
            defaultNodeStyle.descriptionBackgroundColor,
          descriptionDefaultOpen:
            fields.descriptionDefaultOpen.value ??
            defaultNodeStyle.descriptionDefaultOpen,
          descriptionTextColor:
            fields.descriptionTextColor.value ??
            defaultNodeStyle.descriptionTextColor,
          textColor: fields.textColor.value ?? defaultNodeStyle.textColor,
        },
      })
    }}
  >
    <MaterialSymbols
      name="file_copy"
      style="margin-right: 4px;"
      size={18}
    />套用至同類別</Button
  >
</SidebarSection>
