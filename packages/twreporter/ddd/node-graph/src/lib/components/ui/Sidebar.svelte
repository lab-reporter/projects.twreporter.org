<script lang="ts">
  import type { Snippet } from 'svelte'
  import Panel from './Panel.svelte'
  import TabList from '../ui/tabs/TabList.svelte'
  import Tabs from '../ui/tabs/Tabs.svelte'

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
