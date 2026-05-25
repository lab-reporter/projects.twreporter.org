<script lang="ts">
  import EmptyState from '@/lib/components/ui/EmptyState.svelte'
  import Sidebar from '@/lib/components/ui/Sidebar.svelte'
  import {
    useConvexField,
    useConvexOptimisticUpdateValue,
  } from '@/lib/features/use-convex-field.svelte'
  import { normalizeEdgeStyle, normalizeNodeStyle } from '@/lib/utils/canvas'
  import { buildNodeGraphEmbedCode } from '@/lib/utils/embed-code'
  import { useConvexClient } from 'convex-svelte'
  import { api } from '~convex/api'
  import type { Id } from '~convex/dataModel'

  import { DesignApi } from '@/lib/apis/design.svelte'
  import Canvas from '@/lib/components/canvas/Canvas.svelte'
  import { getCanvasContext } from '@/lib/components/canvas/CanvasState.svelte'
  import Header from '@/lib/components/editor/Header.svelte'
  import DesignCanvasTab from '@/lib/components/editor/design/DesignCanvasTab.svelte'
  import DesignEdgeTab from '@/lib/components/editor/design/DesignEdgeTab.svelte'
  import DesignNodeTab from '@/lib/components/editor/design/DesignNodeTab.svelte'
  import DesignTopBar from '@/lib/components/editor/design/DesignTopBar.svelte'
  import type { EdgeStyle, NodeStyle } from '@/lib/components/editor/types'
  import Frame from '@/lib/components/frame/Frame.svelte'
  import TabContent from '@/lib/components/ui/tabs/TabContent.svelte'
  import { getTabsContext } from '@/lib/components/ui/tabs/TabsState.svelte'
  import {
    defaultViewportKey,
    viewports,
    type ViewportKey,
  } from '@/lib/constants/viewports'
  import { buildDesignFlow } from '@/lib/features/canvas/adapter'
  import { route } from '@/routes/router'

  const convex = useConvexClient()
  const canvasState = getCanvasContext()
  const tabsState = getTabsContext('nodes')

  const designApi = new DesignApi()
  const params = $derived(designApi.params)

  const designData = $derived(designApi.designData)

  let activeLayoutKey = $state<ViewportKey>(defaultViewportKey)
  let saveError = $state<string | null>(null)

  const sidebarTabs = {
    nodes: 'nodes',
    edges: 'edges',
    groups: 'groups',
    canvas: 'canvas',
  }

  const frameResolutionRatio = $derived(
    viewports[activeLayoutKey].resolutionRatio,
  )
  const frameContainerAspectRatio = $derived(
    `${frameResolutionRatio[0]} / ${frameResolutionRatio[1]}`,
  )

  const flow = $derived.by(() =>
    buildDesignFlow({
      canvasState,
      graph: designData.data,
      readonly: false,
      activeLayoutKey,
      tooltipsEnabled: canvasState.tooltipsEnabled,
    }),
  )

  let frameRef: HTMLDivElement | null | undefined = $state()

  const embedCode = $derived(buildNodeGraphEmbedCode(designData.data))

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

  const canvasFields = {
    backgroundColor: useConvexOptimisticUpdateValue(
      () => designData.data?.design.backgroundColor ?? undefined,
      (backgroundColor) =>
        designApi.updateDesignMetadata({ patch: { backgroundColor } }),
    ),
    title: useConvexOptimisticUpdateValue(
      () => designData.data?.design.title,
      (title) => designApi.updateDesignMetadata({ patch: { title } }),
    ),
    description: useConvexOptimisticUpdateValue(
      () =>
        designData.data
          ? (designData.data.design.description ?? '')
          : undefined,
      (description) =>
        designApi.updateDesignMetadata({ patch: { description } }),
    ),
    footnotes: useConvexOptimisticUpdateValue(
      () =>
        designData.data ? (designData.data.design.footnotes ?? '') : undefined,
      (footnotes) => designApi.updateDesignMetadata({ patch: { footnotes } }),
    ),
    legends: useConvexOptimisticUpdateValue(
      () => designData.data?.design.legends,
      (legends) => designApi.updateDesignMetadata({ patch: { legends } }),
    ),
  }

  const nodeFields = {
    backgroundColor: useConvexField(
      () => selectedNodeStyle?.backgroundColor,
      (backgroundColor) => updateNodeStyle({ backgroundColor }),
    ),
    borderColor: useConvexField(
      () => selectedNodeStyle?.borderColor,
      (borderColor) => updateNodeStyle({ borderColor }),
    ),
    textColor: useConvexField(
      () => selectedNodeStyle?.textColor,
      (textColor) => updateNodeStyle({ textColor }),
    ),
    descriptionBackgroundColor: useConvexField(
      () => selectedNodeStyle?.descriptionBackgroundColor,
      (descriptionBackgroundColor) =>
        updateNodeStyle({ descriptionBackgroundColor }),
    ),
    descriptionTextColor: useConvexField(
      () => selectedNodeStyle?.descriptionTextColor,
      (descriptionTextColor) => updateNodeStyle({ descriptionTextColor }),
    ),
    descriptionDefaultOpen: useConvexField(
      () => selectedNodeStyle?.descriptionDefaultOpen,
      (descriptionDefaultOpen) => updateNodeStyle({ descriptionDefaultOpen }),
      0,
    ),
  }

  const edgeFields = {
    strokeColor: useConvexField(
      () => selectedEdgeStyle?.strokeColor,
      (strokeColor) => updateEdgeStyle({ strokeColor }),
    ),
    arrowColor: useConvexField(
      () => selectedEdgeStyle?.arrowColor,
      (arrowColor) => updateEdgeStyle({ arrowColor }),
    ),
    labelBackgroundColor: useConvexField(
      () => selectedEdgeStyle?.labelBackgroundColor,
      (labelBackgroundColor) => updateEdgeStyle({ labelBackgroundColor }),
    ),
    labelTextColor: useConvexField(
      () => selectedEdgeStyle?.labelTextColor,
      (labelTextColor) => updateEdgeStyle({ labelTextColor }),
    ),
  }

  $effect(() => {
    if (tabsState.activeTab === sidebarTabs.groups) {
      tabsState.activeTab = sidebarTabs.nodes
    }
  })

  async function updateNodeStyle(patch: Partial<NodeStyle>) {
    if (
      !route.params.designId ||
      canvasState.selectedItem?.type !== 'graph-node'
    ) {
      return
    }

    const nodeId = canvasState.selectedItem.id
    const nodeStyle = normalizeNodeStyle({
      backgroundColor: nodeFields.backgroundColor.value,
      borderColor: nodeFields.borderColor.value,
      textColor: nodeFields.textColor.value,
      descriptionBackgroundColor: nodeFields.descriptionBackgroundColor.value,
      descriptionTextColor: nodeFields.descriptionTextColor.value,
      descriptionDefaultOpen: nodeFields.descriptionDefaultOpen.value,
      ...patch,
    })

    saveError = null

    try {
      await convex.mutation(api.designs.updateDesignNodeStyle, {
        designId: route.params.designId as Id<'designs'>,
        nodeId: nodeId as Id<'nodes'>,
        nodeStyle,
      })
    } catch (error) {
      saveError = error instanceof Error ? error.message : '儲存設定時發生錯誤'
    }
  }

  async function updateEdgeStyle(patch: Partial<EdgeStyle>) {
    if (
      !route.params.designId ||
      canvasState.selectedItem?.type !== 'graph-edge'
    ) {
      return
    }

    const edgeId = canvasState.selectedItem.id
    const edgeStyle = normalizeEdgeStyle({
      strokeColor: edgeFields.strokeColor.value,
      arrowColor: edgeFields.arrowColor.value,
      labelBackgroundColor: edgeFields.labelBackgroundColor.value,
      labelTextColor: edgeFields.labelTextColor.value,
      ...patch,
    })

    saveError = null

    try {
      await convex.mutation(api.designs.updateDesignEdgeStyle, {
        designId: route.params.designId as Id<'designs'>,
        edgeId: edgeId as Id<'edges'>,
        edgeStyle,
      })
    } catch (error) {
      saveError = error instanceof Error ? error.message : '儲存設定時發生錯誤'
    }
  }
</script>

<Header title={designData.data?.design.title} />

<DesignTopBar
  bind:activeLayoutKey
  {frameRef}
  {frameResolutionRatio}
  title={designData.data?.design.title}
  {embedCode}
/>

<Sidebar
  tabs={[
    { label: '節點', value: sidebarTabs.nodes },
    { label: '線段', value: sidebarTabs.edges },
    { label: '群組', value: sidebarTabs.groups, disabled: true },
    { label: '圖表', value: sidebarTabs.canvas },
  ]}
>
  <TabContent value={sidebarTabs.nodes}>
    {#if canvasState.selectedItem?.type === 'graph-node'}
      <DesignNodeTab fields={nodeFields} error={saveError} />
    {:else}
      <EmptyState message="請先在畫布選取一個節點" />
    {/if}
  </TabContent>
  <TabContent value={sidebarTabs.edges}>
    {#if canvasState.selectedItem?.type === 'graph-edge'}
      <DesignEdgeTab fields={edgeFields} error={saveError} />
    {:else}
      <EmptyState message="請先在畫布選取一條線段" />
    {/if}
  </TabContent>
  <TabContent value={sidebarTabs.groups}></TabContent>
  <TabContent value={sidebarTabs.canvas}>
    <DesignCanvasTab fields={canvasFields} />
  </TabContent>
</Sidebar>
<div
  class="frame-preview"
  style:aspect-ratio={frameContainerAspectRatio}
  bind:this={frameRef}
>
  <Frame
    title={designData.data?.design.title}
    description={designData.data?.design.description}
    footnotes={designData.data?.design.footnotes?.split('\n')}
    legends={designData.data?.design.legends}
  >
    <Canvas
      nodes={flow.nodes}
      edges={flow.edges}
      onMoveNodes={async (moves) => {
        if (!route.params.designId) return

        await Promise.all(
          moves.map((move) =>
            convex.mutation(api.designs.setDesignLayoutNodePosition, {
              designId: route.params.designId as Id<'designs'>,
              layoutKey: activeLayoutKey,
              nodeId: move.nodeId,
              position: move.to,
            }),
          ),
        )
      }}
      onUndoMoveNodes={async (moves) => {
        if (!route.params.designId) return

        await Promise.all(
          moves.map((move) =>
            convex.mutation(api.designs.setDesignLayoutNodePosition, {
              designId: route.params.designId as Id<'designs'>,
              layoutKey: activeLayoutKey,
              nodeId: move.nodeId,
              position: move.from,
            }),
          ),
        )
      }}
    />
  </Frame>
</div>

<style>
  .frame-preview {
    height: min(calc(100% - 20px), 1080px);
    margin: auto;
    border: 1px solid var(--neutral-gray-300);
    /* border radius defined in components/frame/Frame.svelte */
    border-radius: 10px;
  }
</style>
