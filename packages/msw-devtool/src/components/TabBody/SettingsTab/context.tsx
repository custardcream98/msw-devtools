import React, { useContext } from "react"

import { useLocalStorageState } from "~/hooks/useLocalStorageState"

type SettingsContextType = {
  defaultResponse: string | null
  setDefaultResponse: (response: string) => void
  defaultUrl: string | null
  setDefaultUrl: (url: string) => void
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

  const [defaultUrl, setDefaultUrl] = useLocalStorageState<string | null>(
    "MSW_DEVTOOL_DEFAULT_URL",
    null
  )

  const value = React.useMemo(
    () => ({ defaultResponse, setDefaultResponse, defaultUrl, setDefaultUrl }),
    [defaultResponse, setDefaultResponse, defaultUrl, setDefaultUrl]
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
