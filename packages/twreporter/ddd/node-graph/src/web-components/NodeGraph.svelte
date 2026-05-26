<script lang="ts">
  import type { DesignQueryData } from '@/lib/apis/convex'
  import { buildDesignFlow } from '@/lib/features/canvas/adapter'
  import { debounce } from '@/lib/utils/debounce'
  import { safeParse } from '@/lib/utils/safe-parse'
  import { useSvelteFlow } from '@xyflow/svelte'
  import Canvas from '../lib/components/canvas/Canvas.svelte'
  import Frame from '../lib/components/frame/Frame.svelte'

  let { data }: { data?: string } = $props()

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
    >
      <Canvas nodes={flow.nodes} edges={flow.edges} readonly />
    </Frame>
  {/if}
</div>

<style>
  :host {
    display: block;
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
    --brand-faded: rgba(244, 198, 198, 1);
    --brand-pastel: rgba(247, 105, 119, 1);
    --brand-main: rgba(248, 11, 40, 1);
    --brand-heavy: rgba(196, 13, 35, 1);
    --brand-dark: rgba(155, 5, 30, 1);
    --neutral-white: rgba(255, 255, 255, 1);
    --neutral-gray-50: rgba(250, 250, 250, 1);
    --neutral-gray-100: rgba(241, 241, 241, 1);
    --neutral-gray-200: rgba(226, 226, 226, 1);
    --neutral-gray-300: rgba(205, 205, 205, 1);
    --neutral-gray-400: rgba(187, 187, 187, 1);
    --neutral-gray-500: rgba(156, 156, 156, 1);
    --neutral-gray-600: rgba(128, 128, 128, 1);
    --neutral-gray-700: rgba(102, 102, 102, 1);
    --neutral-gray-800: rgba(64, 64, 64, 1);
    --neutral-gray-900: rgba(38, 38, 38, 1);
    --neutral-black: rgba(0, 0, 0, 1);
    --supportive-faded: rgba(240, 213, 190, 1);
    --supportive-pastel: rgba(227, 190, 152, 1);
    --supportive-main: rgba(192, 150, 98, 1);
    --supportive-heavy: rgba(159, 117, 68, 1);
    --supportive-dark: rgba(122, 82, 44, 1);
  }

  .node-graph {
    width: 100%;
    height: 80vh;
  }

  .node-graph :global(*) {
    text-align: left !important;
  }
</style>
