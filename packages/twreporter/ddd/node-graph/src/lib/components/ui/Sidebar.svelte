<script lang="ts">
  import type { Snippet } from 'svelte'
  import Panel from './Panel.svelte'
  import TabList from '../tabs/TabList.svelte'
  import Tabs from '../tabs/Tabs.svelte'

  let {
    tabs,
    activeTabValue = $bindable<string | undefined>(),
    children,
    footer,
  }: {
    tabs: {
      label: string
      value: string
      disabled?: boolean
    }[]
    activeTabValue?: string
    children?: Snippet
    footer?: Snippet
  } = $props()
</script>

<Panel variant="left">
  <Tabs bind:activeTabValue>
    <TabList {tabs} />
    {@render children?.()}
  </Tabs>

  {@render footer?.()}
</Panel>
