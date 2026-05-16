<script>
  import { getUser } from '@/lib/auth/user.svelte'
  import { navigate } from '../router'
  import { SignInButton } from 'svelte-clerk/client'

  const { user, isUserLoading } = getUser()
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
