<script lang="ts">
  import { UserButton } from 'svelte-clerk/client'
  import { p } from '../../../routes/router'

  const { title }: { title?: string } = $props()
</script>

<div class="header">
  <a class="title-link" href={p('/')} {title}>
    <h1 class="title">{title}</h1>
  </a>
  <UserButton />
</div>

<style>
  .header {
    display: flex;
    gap: 10px;
    padding: 20px;
    align-items: center;
    justify-content: start;
    min-width: 0;
  }

  .title-link {
    min-width: 0;
    flex: 1 1 auto;
    color: inherit;
    text-decoration: none;
  }

  .title {
    margin: 0;
    font-family: 'Noto Serif TC';
    font-size: var(--text-l);
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
