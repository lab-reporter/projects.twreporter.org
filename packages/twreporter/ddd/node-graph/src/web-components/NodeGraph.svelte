<script lang="ts">
  import type { DesignQueryData } from '@/lib/apis/convex'
  import { buildDesignFlow } from '@/lib/features/canvas/adapter'
  import { debounce } from '@/lib/utils/debounce'
  import { safeParse } from '@/lib/utils/safe-parse'
  import { useSvelteFlow } from '@xyflow/svelte'
  import Canvas from '../lib/components/canvas/Canvas.svelte'
  import Frame from '../lib/components/frame/Frame.svelte'

  let { data, control }: { data?: string; control: boolean } = $props()

  let clientWidth = $state<number>()

  const activeLayoutKey = $derived(
    (clientWidth ?? 0) <= 500 ? 'mobile' : 'desktop',
  )

  const graph = $derived(safeParse<DesignQueryData>(data))

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

  const { fitView } = useSvelteFlow()
  const debouncedFitView = debounce(fitView, 100)

  $effect(() => {
    activeLayoutKey
    clientWidth
    debouncedFitView({
      duration: 100,
      interpolate: 'linear',
      padding: {
        x: '5%',
        y: '5%',
        top: '10%',
        bottom: '10%',
      },
    })
  })
</script>

<div class="node-graph" bind:clientWidth>
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
        elementsSelectable={false}
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

  .node-graph :global(*) {
    text-align: left !important;
  }
</style>
