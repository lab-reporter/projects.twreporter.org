<script lang="ts">
  import { useConvexClient } from 'convex-svelte'
  import { useClerkContext } from 'svelte-clerk/client'
  import { getUser } from '../../auth/user'
  import { navigate, route } from '../../../router'
  import type { Snippet } from 'svelte'

  const { children }: { children: Snippet } = $props()

  const convex = useConvexClient()
  const clerk = useClerkContext()

  $effect.pre(() => {
    const user = getUser()

    if (!user && route.pathname !== '/login') {
      navigate('/login')
    }

    convex.setAuth(
      async () => clerk.session?.getToken({ template: 'convex' }) ?? null,
    )
  })
</script>

{@render children()}
