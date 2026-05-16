import { useClerkContext } from 'svelte-clerk/client'

export function useAuth() {
  const clerk = useClerkContext()
  const user = $derived(clerk.user)
  const isUserLoading = $derived(!clerk.isLoaded)

  return { user, isUserLoading }
}
