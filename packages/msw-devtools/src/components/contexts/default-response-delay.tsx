import React, { useContext, useMemo } from "react"

import { StorageKey } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"

type DefaultResponseDelaySettingsContextType = {
  defaultResponseDelay: number
  setDefaultResponseDelay: (delay: number) => void
}

const DefaultResponseDelaySettingsContext =
  React.createContext<DefaultResponseDelaySettingsContextType | null>(null)

export const useDefaultResponseDelaySettings = () => {
  const context = useContext(DefaultResponseDelaySettingsContext)

  if (!context) {
    throw new Error(
      "[MSW Devtools] useDefaultResponseDelaySettings must be used within a DefaultResponseDelaySettingsProvider"
    )
  }

  return context
}

export const DefaultResponseDelaySettingsProvider = ({
  children
}: React.PropsWithChildren) => {
  const [defaultResponseDelay, setDefaultResponseDelay] = useLocalStorageState(
    StorageKey.RESPONSE_DELAY,
    0.5
  )

  const value = useMemo(
    () => ({
      defaultResponseDelay,
      setDefaultResponseDelay
    }),
    [defaultResponseDelay, setDefaultResponseDelay]
  )

  return (
    <DefaultResponseDelaySettingsContext.Provider value={value}>
      {children}
    </DefaultResponseDelaySettingsContext.Provider>
  )
}
