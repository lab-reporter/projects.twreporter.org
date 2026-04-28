<script lang="ts">
    import { useConvexClient } from 'convex-svelte'
    import {
        Show,
        SignInButton,
        useClerkContext,
        UserButton,
    } from 'svelte-clerk/client'
    import { Router } from 'sv-router'
    import './router.ts'
    import { p } from './router'

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

<a href={p('/')}>Home</a>
<a href={p('/editor')}>Editor</a>

<Router base="#" />
