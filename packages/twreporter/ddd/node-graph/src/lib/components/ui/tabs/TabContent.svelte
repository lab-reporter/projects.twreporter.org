<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { SvelteHTMLElements } from 'svelte/elements'
  import { getTabsContext, type TabValue } from './TabsState.svelte'

  type Props = SvelteHTMLElements['div'] & {
    value: TabValue
    children?: Snippet
  }

  let { value, children, class: className, ...rest }: Props = $props()

  const tabs = getTabsContext()
  const selected = $derived(value === tabs.activeTab)
</script>

{#if children}
  <div
    class={['panel', className]}
    role="tabpanel"
    hidden={!selected}
    {...rest}
  >
    {@render children()}
  </div>
{/if}

<style>
  .panel {
    order: 1;
    flex: 1 1 auto;
    min-height: 0;
    min-width: 0;
    overflow-y: auto;
  }

  .panel[hidden] {
    display: none;
  }
</style>
