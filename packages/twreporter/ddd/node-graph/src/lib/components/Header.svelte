<script>
  import { UserButton } from 'svelte-clerk/client'
  import Logo from './icons/Logo.svelte'
  import { p } from '@/routes/router'
  import H1 from './ui/typography/H1.svelte'
</script>

<div class="header">
  <a href={p('/')}>
    <Logo />
    <H1>節點工具</H1>
  </a>
  <UserButton />
</div>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }

  .header a {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: start;
  }
</style>
