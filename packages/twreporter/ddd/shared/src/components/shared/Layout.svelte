<script lang="ts">
  import {
    QueryCache,
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/svelte-query'
  import type { Snippet } from 'svelte'

  const { children }: { children: Snippet } = $props()
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => console.error(error),
    }),
  })
</script>

<QueryClientProvider client={queryClient}>
  {@render children()}
</QueryClientProvider>
