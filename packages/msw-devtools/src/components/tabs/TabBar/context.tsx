import React, { useContext, useMemo } from "react"

import { StorageKey, Tab } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"

type TabContextType = {
  tab: Tab
  setTab: (tab: Tab) => void
}

const TabContext = React.createContext<TabContextType | null>(null)

export const TabProvider = ({ children }: React.PropsWithChildren) => {
  const [tab, setTab] = useLocalStorageState(StorageKey.TAB, Tab.AddMock)

  const value = useMemo(() => ({ tab, setTab }), [tab, setTab])

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>
}

export const useTab = () => {
  const context = useContext(TabContext)

  if (!context) {
    throw new Error("[MSW Devtools] useTab must be used within a TabProvider")
  }

  return context
}
