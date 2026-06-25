<script lang="ts">
  import { getTabsContext } from './TabsState.svelte'

  const {
    tabs,
  }: {
    tabs: ({ label: string; value: string; disabled?: boolean } | string)[]
  } = $props()

  const tabsContext = getTabsContext()
</script>

<div class="tab-list">
  {#each tabs as tab (typeof tab === 'string' ? tab : tab.value)}
    {@const label = typeof tab === 'string' ? tab : tab.label}
    {@const value = typeof tab === 'string' ? tab : tab.value}
    {@const disabled = typeof tab === 'string' ? false : tab.disabled}
    {@const selected = tabsContext.activeTab === value}
    <button
      class={['tab', selected && 'selected']}
      type="button"
      role="tab"
      aria-selected={selected}
      {disabled}
      onclick={() => {
        if (disabled) return
        tabsContext.activeTab = value
      }}
    >
      {label}
    </button>
  {/each}
</div>

<style>
  .tab-list {
    flex: 0 0 auto;
    padding: 5px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--neutral-gray-100);
    border-radius: 4px;
  }

  .tab {
    display: inline-flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 7px 0;
    border-radius: 4px;
    background: transparent;
    color: var(--neutral-gray-400);
    letter-spacing: 0.6px;
    line-height: 1;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }

  .tab.selected {
    background: var(--neutral-white);
    color: var(--neutral-gray-800);
  }

  .tab:disabled {
    cursor: not-allowed;
    opacity: 0.46;
  }
</style>
