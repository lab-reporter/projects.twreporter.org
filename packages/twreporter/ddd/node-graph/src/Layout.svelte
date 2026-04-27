<script lang="ts">
    import { setupConvex } from 'convex-svelte'
    import { ClerkProvider } from 'svelte-clerk/client'

    import App from './App.svelte'
    import { env } from './environment-variables'

    setupConvex(env.convex.url)
</script>

<ClerkProvider publishableKey={env.clerk.publishableKey}>
    <App />
</ClerkProvider>
