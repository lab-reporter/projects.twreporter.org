import { createContext } from 'svelte'

export type TabValue = string | number

export type TabsContext = {
  activeTabValue: () => TabValue | undefined
  selectTab: (value: TabValue) => void
}

export const [getTabsContext, setTabsContext] = createContext<TabsContext>()
