<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { ClassValue } from 'svelte/elements'

  type Props = {
    title?: string
    class?: ClassValue
    children: Snippet
  }

  let { title, class: className, children }: Props = $props()
</script>

<div class={['sidebar-card', className]}>
  {#if title}
    <div class="title">{title}</div>
  {/if}

  <div class="body">
    {@render children()}
  </div>
</div>

<style>
  .sidebar-card {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 7px;
    border-radius: 4px;
    background: var(--neutral-gray-100);
  }

  .title {
    color: var(--neutral-gray-800);
    font-family: 'Noto Sans TC', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.6px;
    line-height: 1.2;
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
</style>
