<script module lang="ts">
  export type ChipOption = {
    value: string
    label: string
    color?: string
    textColor?: string
    count?: number
  }
</script>

<script lang="ts">
  const {
    options,
    value,
    label,
    variant = 'legend',
    countUnit = '',
    countColor,
    onchange,
  }: {
    options: ChipOption[]
    value?: string
    label: string
    variant?: 'legend' | 'selector'
    countUnit?: string
    countColor?: string
    onchange: (value: string) => void
  } = $props()
</script>

<div
  class="chips"
  class:selector={variant === 'selector'}
  aria-label={label}
  style:--chip-count-color={countColor}
>
  {#each options as option (option.value)}
    <button
      type="button"
      class:active={value === option.value}
      class:dim={variant === 'legend' &&
        value !== undefined &&
        value !== option.value}
      aria-pressed={value === option.value}
      style:--chip-color={option.color}
      style:--chip-text-color={option.textColor}
      onclick={() => onchange(option.value)}
    >
      {#if option.color}<span class="swatch" style:background={option.color}
        ></span>{/if}
      <span>{option.label}</span>
      {#if option.count !== undefined}<span class="count"
          >{option.count}{countUnit ? ` ${countUnit}` : ''}</span
        >{/if}
    </button>
  {/each}
</div>

<style>
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  button {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 12px;
    border: 1px solid var(--neutral-gray-200);
    border-radius: 999px;
    background: var(--neutral-white);
    color: var(--neutral-gray-800);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  button.active {
    border-color: var(--brand-main);
  }
  button:focus-visible {
    outline: 2px solid var(--brand-main);
    outline-offset: 3px;
  }
  .swatch {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    border-radius: 3px;
  }
  .count {
    color: var(--neutral-gray-600);
    white-space: nowrap;
  }
  .dim {
    opacity: 0.25;
  }
  .selector .count {
    padding: 1px 6px;
    border-radius: 999px;
    background: var(--chip-color, var(--chart-mint-1));
    color: var(--chip-text-color, var(--chip-count-color, var(--chart-mint-5)));
    font-size: 11px;
    font-weight: 600;
  }
  .selector button.active {
    border-color: var(--chip-color, var(--brand-main));
    background: var(--chip-color, var(--brand-main));
    color: var(--chip-text-color, var(--neutral-white));
  }
</style>
