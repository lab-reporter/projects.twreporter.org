<script lang="ts">
  import type { Snippet } from 'svelte'
  import Button from './Button.svelte'

  type Props = {
    open?: boolean
    title?: string
    children: Snippet
    onclose?: () => void
  }

  let { open = false, title, children, onclose }: Props = $props()
</script>

{#if open}
  <div class="backdrop" role="presentation" onclick={onclose}>
    <div
      class="dialog"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabindex="-1"
      onclick={(event) => event.stopPropagation()}
      onkeydown={(event) => {
        if (event.key === 'Escape') onclose?.()
      }}
    >
      <header class="header">
        {#if title}
          <h2>{title}</h2>
        {/if}
        <Button label="關閉" variant="outlined" onclick={onclose} />
      </header>

      <div class="body">
        {@render children()}
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    box-sizing: border-box;
    background: rgba(38, 38, 38, 0.45);
  }

  .dialog {
    width: min(720px, 100%);
    max-height: min(680px, 100%);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 8px;
    background: var(--neutral-white);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22);
    font-family: 'Noto Sans TC', sans-serif;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--neutral-gray-200);
  }

  .header h2 {
    margin: 0;
    color: var(--neutral-gray-800);
    font-size: 20px;
    font-weight: 700;
    line-height: 1.4;
  }

  .body {
    min-height: 0;
    overflow: auto;
    padding: 20px 24px 24px;
  }
</style>
