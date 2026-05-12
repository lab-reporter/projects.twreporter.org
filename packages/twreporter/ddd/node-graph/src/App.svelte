<script lang="ts">
    import { Router } from 'sv-router'
    import './router'

    import { setupConvex } from 'convex-svelte'
    import { ClerkProvider } from 'svelte-clerk/client'

    import AuthProvider from './lib/components/providers/AuthProvider.svelte'
    import { clientEnv } from './lib/environment-variables'

    setupConvex(clientEnv.convex.url)

</script>

<ClerkProvider publishableKey={clientEnv.clerk.publishableKey}>
    <AuthProvider>
        <Router base="#" />
    </AuthProvider>
</ClerkProvider>
