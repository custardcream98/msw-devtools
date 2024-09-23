import React, { useContext, useMemo } from "react"

import { useLocalStorageState } from "~/hooks/useLocalStorageState"

type DefaultUrlSettingsContextType = {
  defaultUrl: string | null
  setDefaultUrl: (url: string) => void
}

export const DefaultUrlSettingsContext =
  React.createContext<DefaultUrlSettingsContextType | null>(null)

export const useDefaultUrlSettings = () => {
  const context = useContext(DefaultUrlSettingsContext)

  if (!context) {
    throw new Error(
      "useDefaultUrlSettings must be used within a DefaultUrlSettingsProvider"
    )
  }

  return context
}

export const DefaultUrlSettingsProvider = ({
  children
}: React.PropsWithChildren) => {
  const [defaultUrl, setDefaultUrl] = useLocalStorageState<string | null>(
    "DEFAULT_URL",
    null
  )

  const value = useMemo(
    () => ({
      defaultUrl,
      setDefaultUrl
    }),
    [defaultUrl, setDefaultUrl]
  )

  return (
    <DefaultUrlSettingsContext.Provider value={value}>
      {children}
    </DefaultUrlSettingsContext.Provider>
  )
}
