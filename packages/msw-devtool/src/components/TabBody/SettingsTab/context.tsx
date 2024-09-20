import React, { useContext } from "react"

import { useLocalStorageState } from "~/hooks/useLocalStorageState"

type SettingsContextType = {
  defaultResponse: string | null
  setDefaultResponse: (response: string) => void
}

export const SettingsContext = React.createContext<SettingsContextType | null>(
  null
)

export const useSettings = () => {
  const context = useContext(SettingsContext)

  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }

  return context
}

export const SettingsProvider = ({ children }: React.PropsWithChildren) => {
  const [defaultResponse, setDefaultResponse] = useLocalStorageState<
    string | null
  >("MSW_DEVTOOL_DEFAULT_RESPONSE", null)

  const value = React.useMemo(
    () => ({ defaultResponse, setDefaultResponse }),
    [defaultResponse, setDefaultResponse]
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
