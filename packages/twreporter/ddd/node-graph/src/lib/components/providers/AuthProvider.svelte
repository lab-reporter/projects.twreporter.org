<script lang="ts">
  import { useConvexClient } from 'convex-svelte'
  import { useClerkContext } from 'svelte-clerk/client'
  import { navigate, route } from '../../../routes/router'
  import type { Snippet } from 'svelte'

  const { children }: { children: Snippet } = $props()

  const convex = useConvexClient()
  const clerk = useClerkContext()
  const user = $derived(clerk.user)
  const isUserLoading = $derived(!clerk.isLoaded)

  $effect(() => {
    if (isUserLoading) return

    if (!user && route.pathname !== '/login') {
      navigate('/login')
    }
  })

  $effect.pre(() => {
    convex.setAuth(
      async () => clerk.session?.getToken({ template: 'convex' }) ?? null,
    )
  })
</script>

{@render children()}
