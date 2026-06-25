<script lang="ts">
  import MaterialSymbols from '../../icons/MaterialSymbols.svelte'

  let {
    label,
    checked = $bindable(false),
  }: { label: string; checked?: boolean } = $props()
</script>

<div class="checkbox-row">
  <span class="label">{label}</span>

  <button
    class={['checkbox', checked && 'checked']}
    aria-hidden="true"
    onclick={() => (checked = !checked)}
  >
    {#if checked}
      <MaterialSymbols name="check_small" size={20} />
    {/if}
  </button>
</div>

<style>
  .checkbox-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 35px;
    padding: 7px;
    border-radius: 4px;
    background: var(--neutral-gray-100);
  }

  .label {
    color: var(--neutral-gray-800);
    font-family: 'Noto Sans TC', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.6px;
    line-height: 1.2;
  }

  .checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: 0.5px solid var(--neutral-gray-400);
    border-radius: 4px;
    background: var(--neutral-gray-50);
    color: transparent;
    box-sizing: border-box;
  }

  .checkbox.checked {
    color: var(--neutral-gray-600);
  }
</style>
