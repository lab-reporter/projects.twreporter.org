<script lang="ts">
    import { setupConvex } from 'convex-svelte'
    import { ClerkProvider } from 'svelte-clerk/client'

    import App from './App.svelte'
    import { clientEnv } from './environment-variables'

    setupConvex(clientEnv.convex.url)
</script>

<ClerkProvider publishableKey={clientEnv.clerk.publishableKey}>
    <App />
</ClerkProvider>
