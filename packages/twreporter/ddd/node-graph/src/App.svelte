<script lang="ts">
  import { Router } from 'sv-router'
  import './router'

  import { SvelteFlowProvider } from '@xyflow/svelte'
  import { setupConvex } from 'convex-svelte'
  import { ClerkProvider } from 'svelte-clerk/client'

  import AuthProvider from './lib/components/providers/AuthProvider.svelte'
  import { clientEnv } from './lib/environment-variables'

  import { Toaster } from 'svelte-sonner'

  setupConvex(clientEnv.convex.url)
</script>

<ClerkProvider publishableKey={clientEnv.clerk.publishableKey}>
  <AuthProvider>
    <SvelteFlowProvider>
      <Router base="#" />
      <Toaster />
    </SvelteFlowProvider>
  </AuthProvider>
</ClerkProvider>
