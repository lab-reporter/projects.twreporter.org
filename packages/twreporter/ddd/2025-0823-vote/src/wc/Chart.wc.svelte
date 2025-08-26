<svelte:options customElement={{ tag: 'twreporter-chart' }} />

<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'

  import Chart from './Chart.svelte'

  const queryClient = new QueryClient()

  let {
    cands,
    pageIndex,
    totalPage,
    title,
  }: { cands: string; pageIndex?: number; totalPage?: number; title: string } =
    $props()
</script>

<QueryClientProvider client={queryClient}>
  <Chart {cands} {pageIndex} {totalPage} {title} />
</QueryClientProvider>
