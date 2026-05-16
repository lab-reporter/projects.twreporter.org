<script lang="ts">
  import { useConvexClient } from 'convex-svelte'
  import { useClerkContext } from 'svelte-clerk/client'
  import { navigate, route } from '../../../router'
  import type { Snippet } from 'svelte'
  import { useAuth } from '@/lib/features/use-auth.svelte'

  const { children }: { children: Snippet } = $props()

  const convex = useConvexClient()
  const clerk = useClerkContext()
  const { user, isUserLoading } = useAuth()

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
