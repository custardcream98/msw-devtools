import React, { useCallback, useContext, useMemo, useState } from "react"

import { StorageKey, Tab } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import { JsonMock } from "~/types"

type TabState = {
  prevEdited?: JsonMock
}

type TabContextType = {
  tab: Tab
  setTab: (tab: Tab, state?: TabState) => void
  tabState?: TabState
}

const TabContext = React.createContext<TabContextType | null>(null)

export const TabProvider = ({ children }: React.PropsWithChildren) => {
  const [tab, _setTab] = useLocalStorageState(StorageKey.TAB, Tab.AddMock)
  const [tabState, setTabState] = useState<TabState>()

  const setTab = useCallback(
    (tab: Tab, state?: TabState) => {
      _setTab(tab)
      setTabState(state)
    },
    [_setTab]
  )

  const value = useMemo(
    () => ({ tab, tabState, setTab }),
    [tab, tabState, setTab]
  )

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>
}

export const useTab = () => {
  const context = useContext(TabContext)

  if (!context) {
    throw new Error("[MSW Devtools] useTab must be used within a TabProvider")
  }

  return context
}
