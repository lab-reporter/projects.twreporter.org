<svelte:options customElement={{ tag: 'twreporter-map' }} />

<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'

  import Map from './Map.svelte'

  const queryClient = new QueryClient()

  let {
    'map-area': area,
    'data-area': dataArea,
  }: { 'map-area': string; 'data-area': string } = $props()
</script>

<QueryClientProvider client={queryClient}>
  <Map map-area={area} data-area={dataArea} />
</QueryClientProvider>
