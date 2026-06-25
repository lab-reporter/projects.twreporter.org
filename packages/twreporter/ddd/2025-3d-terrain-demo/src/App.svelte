<script lang="ts">
  import Cesium from './Cesium.svelte'
  import CesiumEdit from './CesiumEdit.svelte'
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'

  const searchParams = new URLSearchParams(window.location.search)
  const editMode = searchParams.has('edit')

  const queryClient = new QueryClient()
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

<QueryClientProvider client={queryClient}>
  <main>
    {#if editMode}
      <CesiumEdit />
    {:else}
      <Cesium />
    {/if}
  </main>
</QueryClientProvider>

<style>
  :global(*) {
    --tr-text: #404040;
    --tr-background: #f1f1f1;
    color: var(--tr-text);
    font-family: 'Roboto Slab', 'Noto Sans TC', sans-serif;
    text-align: left !important;
  }
</style>
