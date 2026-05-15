<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { ClassValue, HTMLButtonAttributes } from 'svelte/elements'

  type Variant = 'filled' | 'outlined'

  type Props = Omit<HTMLButtonAttributes, 'children' | 'class'> & {
    label?: string
    children?: Snippet
    class?: ClassValue
    variant?: Variant
  }

  let {
    label,
    children,
    class: className,
    variant = 'outlined',
    type = 'button',
    disabled = false,
    'aria-label': ariaLabel = label,
    ...rest
  }: Props = $props()
</script>

<button
  class={['button', variant, className]}
  {type}
  {disabled}
  aria-label={ariaLabel}
  {...rest}
>
  {#if children}
    {@render children()}
  {:else if label}
    <span>{label}</span>
  {/if}
</button>

<style>
  .button {
    --button-background: var(--neutral-white);
    --button-border: var(--supportive-heavy);
    --button-color: var(--supportive-heavy);

    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    padding: 9px 15px;
    border: 1px solid var(--button-border);
    border-radius: 4px;
    box-sizing: border-box;
    background: var(--button-background);
    color: var(--button-color);
    font-family: 'Noto Sans TC', sans-serif;
    font-size: 18px;
    font-weight: 400;
    letter-spacing: 0.6px;
    line-height: 1.2;
    white-space: nowrap;
    cursor: pointer;
    appearance: none;
  }

  .button.filled,
  .button.filled span {
    --button-background: var(--supportive-heavy);
    --button-border: transparent;
    --button-color: var(--neutral-gray-100);
    color: var(--neutral-gray-100);

    font-weight: 500;
  }

  .button:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .button:focus-visible {
    outline: 2px solid var(--supportive-heavy);
    outline-offset: 2px;
  }
</style>
