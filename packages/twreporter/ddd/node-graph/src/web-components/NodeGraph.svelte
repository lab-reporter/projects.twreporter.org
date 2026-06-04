<script lang="ts">
  import type { DesignQueryData } from '@/lib/apis/convex'
  import { buildDesignFlow } from '@/lib/features/canvas/adapter'
  import { debounce } from '@/lib/utils/debounce'
  import { safeParse } from '@/lib/utils/safe-parse'
  import {
    type FitBoundsOptions,
    type Rect,
    useSvelteFlow,
  } from '@xyflow/svelte'
  import Canvas from '../lib/components/canvas/Canvas.svelte'
  import Frame from '../lib/components/frame/Frame.svelte'
  import { setCanvasContext } from '@/lib/components/canvas/CanvasState.svelte'
  import { fitViewPadding } from '@/lib/constants/viewports'

  let {
    data,
    control,
    bounds,
  }: { data?: string; control: boolean; bounds?: string } = $props()

  let clientWidth = $state<number>()

  const activeLayoutKey = $derived(
    (clientWidth ?? 0) <= 500 ? 'mobile' : 'desktop',
  )

  const graph = $derived(safeParse<DesignQueryData>(data))
  const initialBounds = $derived(safeParse<Rect>(bounds))

  const footnotes = $derived(
    [graph?.design?.footnotes?.trim()].filter((a) => a !== undefined),
  )
  const flow = $derived.by(() =>
    buildDesignFlow({
      graph,
      readonly: true,
      activeLayoutKey,
      tooltipsEnabled: true,
    }),
  )

  const { fitView, fitBounds } = useSvelteFlow()
  const debouncedFitView = debounce(fitView, 100)
  const debouncedFitBounds = debounce(fitBounds, 100)

  const fitOptions: FitBoundsOptions = {
    duration: 100,
    interpolate: 'linear',
  }

  $effect(() => {
    activeLayoutKey
    clientWidth

    if (initialBounds) {
      debouncedFitBounds(initialBounds, {
        ...fitOptions,
      })
    } else {
      debouncedFitView({
        ...fitOptions,
        padding: fitViewPadding,
      })
    }
  })

  $effect.pre(() => {
    const timeout = setTimeout(
      () => fitView({ ...fitOptions, padding: fitViewPadding }),
      3000,
    )

    return () => clearTimeout(timeout)
  })

  setCanvasContext(undefined, {
    fadeNotConnectedNodes: true,
  })
</script>

<div class={['node-graph', { control }]} bind:clientWidth>
  {#if graph}
    <Frame
      title={graph.design?.title}
      description={graph.design?.description}
      {footnotes}
      controls={control}
    >
      <Canvas
        nodes={flow.nodes}
        edges={flow.edges}
        readonly={!control}
        elementsSelectable={true}
        maxZoom={1.5}
        zoomOnScroll={false}
        panOnScroll={false}
        preventScrolling={false}
      />
    </Frame>
  {/if}
</div>

<style>
  .node-graph {
    width: 100%;
    height: 80vh;
    max-width: 720px;
    margin: 0 auto;
  }

  .node-graph.control {
    max-width: 100vw;
  }

  .node-graph :global(*) {
    text-align: left !important;
  }
</style>
