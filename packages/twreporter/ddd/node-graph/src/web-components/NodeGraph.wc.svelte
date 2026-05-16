<svelte:options customElement={{ tag: 'twreporter-node-graph' }} />

<script lang="ts">
  import { SvelteFlowProvider } from '@xyflow/svelte'
  import NodeGraph from './NodeGraph.svelte'

  let { data }: { data?: string } = $props()
</script>

<SvelteFlowProvider>
  <NodeGraph {data} />
</SvelteFlowProvider>

<style>
  :host {
    display: block;
    width: 100%;
    max-width: 720px;
    aspect-ratio: 1 / 1;
    margin: 0 auto;
  }
</style>
