<svelte:options customElement={{ tag: 'twreporter-node-graph' }} />

<script lang="ts">
  import StyleWrapper from '@/lib/components/StyleWrapper.svelte'
  import { SvelteFlowProvider } from '@xyflow/svelte'
  import NodeGraph from './NodeGraph.svelte'

  let {
    data,
    control = 'false',
    bounds,
  }: { data?: string; control?: string; bounds?: string } = $props()

  let parsedControl = $derived(control === 'true' ? true : false)
</script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@xyflow/svelte@1.5.2/dist/style.css"
/>

<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
  rel="stylesheet"
/>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/tailwindcss-preflight@1.0.1/preflight.min.css"
  crossorigin="anonymous"
/>

<StyleWrapper>
  <SvelteFlowProvider>
    <NodeGraph {data} control={parsedControl} {bounds} />
  </SvelteFlowProvider>
</StyleWrapper>
