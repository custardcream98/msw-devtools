import React, { useContext, useMemo } from "react"

import { useLocalStorageState } from "~/hooks/useLocalStorageState"

type DefaultResponseSettingsContextType = {
  defaultResponse: string | null
  setDefaultResponse: (response: string) => void
}

export const DefaultResponseSettingsContext =
  React.createContext<DefaultResponseSettingsContextType | null>(null)

export const useDefaultResponseSettings = () => {
  const context = useContext(DefaultResponseSettingsContext)

  if (!context) {
    throw new Error(
      "useDefaultResponseSettings must be used within a DefaultResponseSettingsProvider"
    )
  }

  return context
}

export const DefaultResponseSettingsProvider = ({
  children
}: React.PropsWithChildren) => {
  const [defaultResponse, setDefaultResponse] = useLocalStorageState<
    string | null
  >("MSW_DEVTOOLS_DEFAULT_RESPONSE", null)

  const value = useMemo(
    () => ({
      defaultResponse,
      setDefaultResponse
    }),
    [defaultResponse, setDefaultResponse]
  )

  return (
    <DefaultResponseSettingsContext.Provider value={value}>
      {children}
    </DefaultResponseSettingsContext.Provider>
  )
}
