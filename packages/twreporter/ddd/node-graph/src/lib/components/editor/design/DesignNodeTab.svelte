<script lang="ts">
  import { DesignApi } from '@/lib/apis/design.svelte'
  import { useConvexOptimisticUpdateValue } from '@/lib/features/use-convex-field.svelte'
  import { normalizeNodeStyle } from '@/lib/utils/canvas'
  import type { Id } from '~convex/dataModel'
  import { getCanvasContext } from '../../canvas/CanvasState.svelte'
  import SidebarCheckboxRow from '../../ui/sidebar/SidebarCheckboxRow.svelte'
  import SidebarColorInput from '../../ui/sidebar/SidebarColorInput.svelte'
  import SidebarSection from '../../ui/sidebar/SidebarSection.svelte'
  import type { NodeStyle } from '../types'

  const canvasState = getCanvasContext()

  const designApi = new DesignApi()

  const designData = $derived(designApi.designData)

  const selectedNodeStyle = $derived.by(() => {
    const data = designData.data

    if (!data || canvasState.selectedItem?.type !== 'graph-node') {
      return undefined
    }

    return normalizeNodeStyle(
      data.designNodes.find(
        (designNode) => designNode.nodeId === canvasState.selectedItem?.id,
      )?.nodeStyle,
    )
  })

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
      () => selectedNodeStyle?.backgroundColor,
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
  <SidebarColorInput label="文字" bind:value={fields.textColor.value} />
  <SidebarColorInput
    label="描述背景"
    bind:value={fields.descriptionBackgroundColor.value}
  />
  <SidebarColorInput
    label="描述文字"
    bind:value={fields.descriptionTextColor.value}
  />

  <button
    class="checkbox-button"
    type="button"
    onclick={() => {
      fields.descriptionDefaultOpen.value = !fields.descriptionDefaultOpen.value
    }}
  >
    <SidebarCheckboxRow
      label="預設開啟描述"
      checked={fields.descriptionDefaultOpen.value}
    />
  </button>
</SidebarSection>

<style>
  .checkbox-button {
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    text-align: inherit;
  }
</style>
