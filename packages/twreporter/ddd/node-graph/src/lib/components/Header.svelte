<script>
  import { UserButton } from 'svelte-clerk/client'
  import Logo from './icons/Logo.svelte'
  import { p } from '@/routes/router'
</script>

<div class="header">
  <a href={p('/')}>
    <Logo />
    <h1>節點工具</h1>
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

  h1 {
    font-size: var(--text-l);
    font-weight: 700;
    line-height: 1.2;
    font-family: 'Noto Serif TC';
  }
</style>
