import { searchParams } from 'sv-router'
import { getContext, setContext } from 'svelte'

export type TabValue = string | number

export type TabsContext = {
  activeTabValue: () => TabValue | undefined
  selectTab: (value: TabValue) => void
}

class TabsState {
  activeTab = $state<string | undefined>()

  constructor() {
    $effect(() => {
      this.activeTab = searchParams.get('tab')?.toString() ?? undefined
    })

    $effect(() => {
      if (this.activeTab) {
        searchParams.set('tab', this.activeTab)
      }
    })
  }
}

const contextKey = '$_tabs_state'

export function getTabsContext(defaultValue?: string): TabsState {
  return getContext(contextKey)
}

export function setTabsContext() {
  const tabsState = new TabsState()
  return setContext(contextKey, tabsState)
}
