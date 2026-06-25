<script>
  import { navigate } from '../router'
  import { SignInButton, useClerkContext } from 'svelte-clerk/client'

  const clerk = useClerkContext()
  const user = $derived(clerk.user)
  const isUserLoading = $derived(!clerk.isLoaded)
  $effect(() => {
    if (isUserLoading) return

    if (user) {
      navigate('/')
    }
  })
</script>

<div class="signin-prompt">
  <SignInButton>登入</SignInButton>
</div>

<style>
  .signin-prompt {
    font-size: 20px;
    grid-column: 1 / span 2;
    grid-row: 1 / span 2;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
