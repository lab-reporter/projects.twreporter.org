import { useClerkContext } from 'svelte-clerk/client'

export function getUser() {
  const clerk = useClerkContext()
  const user = $derived(clerk.user)
  const isUserLoading = $derived(!clerk.isLoaded)

  return { user, isUserLoading }
}
