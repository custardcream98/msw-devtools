import React, { useContext, useMemo, useState } from "react"

export enum Tab {
  AddMock = "Add Mock",
  ActivatedMockList = "Activated Mock List"
}

type TabContextType = {
  tab: Tab
  setTab: (tab: Tab) => void
}

const TabContext = React.createContext<TabContextType | null>(null)

export const TabProvider = ({
  children,
  initialTab
}: React.PropsWithChildren<{ initialTab: Tab }>) => {
  const [tab, setTab] = useState(initialTab)

  const value = useMemo(() => ({ tab, setTab }), [tab])

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>
}

export const useTab = () => {
  const context = useContext(TabContext)

  if (!context) {
    throw new Error("useTab must be used within a TabProvider")
  }

  return context
}
