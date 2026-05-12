import { useClerkContext } from "svelte-clerk/client";

export function getUser() {
  const clerk = useClerkContext()

  return clerk.user
}
