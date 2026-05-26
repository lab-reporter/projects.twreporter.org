<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = {
    title: string
    children: Snippet
  }

  let { title, children }: Props = $props()
</script>

<section class="sidebar-section">
  <div class="header">
    <div class="title-group">
      <h2>{title}</h2>
    </div>
  </div>

  <div class="content">
    {@render children()}
  </div>
</section>

<style>
  .sidebar-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 10px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .title-group {
    display: flex;
    align-items: center;
    gap: 5px;
    min-width: 0;
  }

  h2 {
    margin: 0;
    color: var(--neutral-gray-800);
    font-family: 'Noto Sans TC', sans-serif;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 0.6px;
    line-height: 1.2;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
