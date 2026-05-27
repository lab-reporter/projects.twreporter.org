<script lang="ts">
  import EmptyState from '@/lib/components/ui/EmptyState.svelte'
  import Sidebar from '@/lib/components/ui/Sidebar.svelte'
  import { buildNodeGraphEmbedCode } from '@/lib/utils/embed-code'

  import { DesignApi } from '@/lib/apis/design.svelte'
  import Canvas from '@/lib/components/canvas/Canvas.svelte'
  import { getCanvasContext } from '@/lib/components/canvas/CanvasState.svelte'
  import Header from '@/lib/components/editor/Header.svelte'
  import DesignCanvasTab from '@/lib/components/editor/design/DesignCanvasTab.svelte'
  import DesignEdgeTab from '@/lib/components/editor/design/DesignEdgeTab.svelte'
  import DesignNodeTab from '@/lib/components/editor/design/DesignNodeTab.svelte'
  import DesignTopBar from '@/lib/components/editor/design/DesignTopBar.svelte'
  import Frame from '@/lib/components/frame/Frame.svelte'
  import TabContent from '@/lib/components/ui/tabs/TabContent.svelte'
  import { getTabsContext } from '@/lib/components/ui/tabs/TabsState.svelte'
  import {
    defaultViewportKey,
    viewports,
    type ViewportKey,
  } from '@/lib/constants/viewports'
  import { buildDesignFlow } from '@/lib/features/canvas/adapter'

  const canvasState = getCanvasContext()
  const tabsState = getTabsContext('nodes')

  const designApi = new DesignApi()

  const designData = $derived(designApi.designData)

  let activeLayoutKey = $state<ViewportKey>(defaultViewportKey)
  let activeLayout = $derived(viewports[activeLayoutKey])
  let isOverrideActive = $state(false)
  let overrideRatio = $state<[number, number]>([100, 100])

  const sidebarTabs = {
    nodes: 'nodes',
    edges: 'edges',
    groups: 'groups',
    canvas: 'canvas',
  }

  const frameResolutionRatio = $derived(
    (activeLayout.allowOverride && isOverrideActive
      ? overrideRatio
      : activeLayout.resolutionRatio) ?? activeLayout.resolutionRatio,
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

  $effect(() => {
    if (canvasState.selectedItem?.type === 'graph-node') {
      tabsState.activeTab = sidebarTabs.nodes
    } else if (canvasState.selectedItem?.type === 'graph-edge') {
      tabsState.activeTab = sidebarTabs.edges
    } else {
      tabsState.activeTab = sidebarTabs.canvas
    }
  })
</script>

<Header title={designData.data?.design.title} />

<DesignTopBar bind:activeLayoutKey {frameRef} {frameResolutionRatio} />

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
      <DesignNodeTab />
    {:else}
      <EmptyState message="請先在畫布選取一個節點" />
    {/if}
  </TabContent>
  <TabContent value={sidebarTabs.edges}>
    {#if canvasState.selectedItem?.type === 'graph-edge'}
      <DesignEdgeTab />
    {:else}
      <EmptyState message="請先在畫布選取一條線段" />
    {/if}
  </TabContent>
  <TabContent value={sidebarTabs.groups}></TabContent>
  <TabContent value={sidebarTabs.canvas}>
    <DesignCanvasTab bind:overrideRatio bind:isOverrideActive {activeLayout} />
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
        await designApi.setDesignLayoutNodePositions({
          layoutKey: activeLayoutKey,
          moves: moves.map((move) => ({
            nodeId: move.nodeId,
            position: move.to,
          })),
        })
      }}
      onUndoMoveNodes={async (moves) => {
        await designApi.setDesignLayoutNodePositions({
          layoutKey: activeLayoutKey,
          moves: moves.map((move) => ({
            nodeId: move.nodeId,
            position: move.from,
          })),
        })
      }}
    />
  </Frame>
</div>

<style>
  .frame-preview {
    height: min(calc(100% - 20px), 1080px);
    margin: auto;
  }
</style>
