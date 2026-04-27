<script lang="ts">
    import {
        ClerkProvider,
        Show,
        SignInButton,
        useClerkContext,
        UserButton,
    } from 'svelte-clerk/client'
    import { setupConvex, useConvexClient } from 'convex-svelte'

    import { env } from './environment-variables'

    const convex = useConvexClient()
    const clerk = useClerkContext()

    $effect.pre(() => {
        convex.setAuth(
            async () => clerk.session?.getToken({ template: 'convex' }) ?? null,
        )
    })
</script>

<Show when="signed-out">
    <SignInButton />
</Show>
<Show when="signed-in">
    <UserButton />
</Show>
<div>Hello, World!</div>
