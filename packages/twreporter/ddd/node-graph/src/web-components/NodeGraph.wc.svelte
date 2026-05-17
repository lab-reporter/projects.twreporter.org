<svelte:options customElement={{ tag: 'twreporter-node-graph' }} />

<script lang="ts">
  import { SvelteFlowProvider } from '@xyflow/svelte'
  import NodeGraph from './NodeGraph.svelte'

  let { data }: { data?: string } = $props()
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

<SvelteFlowProvider>
  <NodeGraph {data} />
</SvelteFlowProvider>

<style>
  :host {
    display: block;
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
  }
</style>
