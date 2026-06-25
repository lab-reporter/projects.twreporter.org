<!-- svelte-ignore custom_element_props_identifier -->
<svelte:options customElement={{ tag: 'twreporter-3d-terrain' }} />

<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
  import Cesium from '../Cesium.svelte'
  import CesiumEdit from '../CesiumEdit.svelte'

  let { docId, edit = false }: { docId?: string; edit?: boolean } = $props()

  const queryClient = new QueryClient()
  const containerId = `cesium-container-${crypto.randomUUID()}`
  const cesiumBaseUrl = (import.meta as any).env.VITE_CESIUM_BASE_URL
  const cesiumWidgetsCss = `${cesiumBaseUrl}/Widgets/widgets.css`
</script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/tailwindcss-preflight@1.0.1/preflight.min.css"
  crossorigin="anonymous"
/>
<link
  rel="preconnect"
  href="https://fonts.googleapis.com"
  crossorigin="anonymous"
/>
<link
  rel="preconnect"
  href="https://fonts.gstatic.com"
  crossorigin="anonymous"
/>
<link
  href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&family=Roboto+Slab:wght@100..900&display=swap"
  rel="stylesheet"
  crossorigin="anonymous"
/>
<link rel="stylesheet" href={cesiumWidgetsCss} crossorigin="anonymous" />

<QueryClientProvider client={queryClient}>
  {#if edit}
    <CesiumEdit {containerId} {docId} />
  {:else}
    <Cesium {containerId} {docId} />
  {/if}
</QueryClientProvider>

<style>
  :host {
    --tr-text: #404040;
    --tr-background: #f1f1f1;
    color: var(--tr-text);
    display: block;
    font-family: 'Roboto Slab', 'Noto Sans TC', sans-serif;
    text-align: left !important;
  }

  :global(*) {
    color: var(--tr-text);
    font-family: 'Roboto Slab', 'Noto Sans TC', sans-serif;
    text-align: left !important;
  }
</style>
