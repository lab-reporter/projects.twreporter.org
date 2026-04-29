<script lang="ts">
    import { useConvexClient } from 'convex-svelte'
    import { Router } from 'sv-router'
    import { useClerkContext } from 'svelte-clerk/client'
    import Layout from './lib/components/Layout.svelte'
    import './router'

    const convex = useConvexClient()
    const clerk = useClerkContext()

    $effect.pre(() => {
        convex.setAuth(
            async () => clerk.session?.getToken({ template: 'convex' }) ?? null,
        )
    })
</script>

<Layout>
    <Router base="#" />
</Layout>
