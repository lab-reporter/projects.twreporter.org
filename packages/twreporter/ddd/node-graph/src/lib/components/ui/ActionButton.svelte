<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  type Props = HTMLButtonAttributes & {
    label?: string
    children?: Snippet
  }

  const {
    label,
    children,
    class: className,
    type = 'button',
    'aria-label': ariaLabel = label,
    ...rest
  }: Props = $props()
</script>

<button class={['button', className]} {type} aria-label={ariaLabel} {...rest}>
  <span class="surface" aria-hidden="true">
    <span class="icon">
      {@render children?.()}
    </span>
  </span>

  {#if label}
    <span class="label">{label}</span>
  {/if}
</button>

<style>
  .button {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--neutral-gray-600);
    font-family: 'Noto Sans TC', sans-serif;
    font-size: 10px;
    font-weight: 500;
    line-height: 1;
    cursor: pointer;
    appearance: none;
  }

  .button:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .button:focus-visible {
    outline: 2px solid var(--neutral-gray-600);
    outline-offset: 4px;
  }

  .button.active .surface,
  .button[aria-pressed='true'] .surface,
  .button[aria-pressed='true'] .icon {
    border-color: var(--supportive-heavy);
    background: var(--supportive-heavy);
    color: var(--neutral-white);
  }

  .surface {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--neutral-gray-200);
    border-radius: 4px;
    background: var(--neutral-white);
    color: var(--neutral-gray-800);
    box-sizing: border-box;
  }

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }

  .icon :global(svg),
  .icon :global(img) {
    display: block;
    width: 100%;
    height: 100%;
  }

  .label {
    color: inherit;
    white-space: nowrap;
  }
</style>
