<script lang="ts">
    import {
        ClerkProvider,
        Show,
        SignInButton,
        UserButton,
    } from 'svelte-clerk/client'

    import { env } from './environment-variables'
</script>

<ClerkProvider publishableKey={env.clerk.publishableKey}>
    <Show when="signed-out">
        <SignInButton />
    </Show>
    <Show when="signed-in">
        <UserButton />
    </Show>
    <div>Hello, World!</div>
</ClerkProvider>
