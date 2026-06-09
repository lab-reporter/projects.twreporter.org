<script lang="ts">
  import { DesignApi } from '@/lib/apis/design.svelte'
  import { defaultNodeStyle } from '@/lib/constants/styles'
  import { useConvexOptimisticUpdateValue } from '@/lib/features/use-convex-field.svelte'
  import { normalizeNodeStyle } from '@/lib/utils/canvas'
  import { useConvexClient, useQuery } from 'convex-svelte'
  import { api } from '~convex/api'
  import type { Id } from '~convex/dataModel'
  import { getCanvasContext } from '../../canvas/CanvasState.svelte'
  import MaterialSymbols from '../../icons/MaterialSymbols.svelte'
  import Button from '../../ui/Button.svelte'
  import SidebarCheckboxRow from '../../ui/sidebar/SidebarCheckboxRow.svelte'
  import SidebarColorInput from '../../ui/sidebar/SidebarColorInput.svelte'
  import SidebarSection from '../../ui/sidebar/SidebarSection.svelte'
  import type { NodeStyle } from '../types'
  import EmptyState from '../../ui/EmptyState.svelte'

  const canvasState = getCanvasContext()
  const convex = useConvexClient()

  const designApi = new DesignApi()

  const designData = $derived(designApi.designData)
  const selectableNodes = useQuery(api.designs.listSelectableNodes, {
    graphId: designApi.params.graphId,
    designId: designApi.params.designId,
  })

  let selectedNodeId = $state<Id<'nodes'> | ''>('')

  const hasSelectableNode = $derived(
    selectableNodes.data?.some((node) => !node.selected) ?? false,
  )

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

  async function addSelectedNodeToDesign() {
    if (!selectedNodeId) return

    await convex.mutation(api.designs.addNodeToDesign, {
      designId: designApi.params.designId,
      nodeId: selectedNodeId,
    })

    selectedNodeId = ''
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

{#if canvasState.selectedItem?.type === 'graph-node'}
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

        await convex.mutation(
          api.designs.updateDesignNodeStylesToSameCategory,
          {
            designId: designApi.params.designId,
            nodeId: designApi.canvasState.selectedItem.id as Id<'nodes'>,
            style: {
              backgroundColor:
                fields.backgroundColor.value ??
                defaultNodeStyle.backgroundColor,
              borderColor:
                fields.borderColor.value ?? defaultNodeStyle.borderColor,
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
          },
        )
      }}
    >
      <MaterialSymbols
        name="file_copy"
        style="margin-right: 4px;"
        size={18}
      />套用至同類別</Button
    >
    <Button
      onclick={async () => {
        if (designApi.canvasState.selectedItem?.type !== 'graph-node') return

        await convex.mutation(api.designs.removeNodeFromDesign, {
          designId: designApi.params.designId,
          nodeId: designApi.canvasState.selectedItem.id as Id<'nodes'>,
        })
      }}
    >
      從設計中刪除
    </Button>
  </SidebarSection>
{:else}
  <EmptyState message="請先在畫布選取要編輯的節點" />
  <SidebarSection title="新增節點">
    <div class="field">
      <label for="design-node-select">節點</label>
      <select
        id="design-node-select"
        bind:value={selectedNodeId}
        disabled={!hasSelectableNode}
      >
        <option value="">選擇節點</option>
        {#each selectableNodes.data ?? [] as node (node._id)}
          <option value={node._id} disabled={node.selected}>
            {node.label}{node.selected ? '（已加入）' : ''}
          </option>
        {/each}
      </select>
    </div>

    <Button
      variant="filled"
      disabled={!selectedNodeId}
      onclick={addSelectedNodeToDesign}
    >
      <MaterialSymbols name="add" style="margin-right: 4px;" size={18} />新增節點
    </Button>
  </SidebarSection>
{/if}

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: var(--neutral-gray-800);
    font-size: 13px;
    font-weight: 500;
  }

  select {
    width: 100%;
    min-height: 34px;
    border: 1px solid var(--neutral-gray-300);
    border-radius: 4px;
    padding: 7px 9px;
    background: var(--neutral-white);
    color: var(--neutral-gray-800);
    font: inherit;
    box-sizing: border-box;
  }
</style>
