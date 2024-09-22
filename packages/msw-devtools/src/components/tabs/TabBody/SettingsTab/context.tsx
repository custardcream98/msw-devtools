import React, { useContext } from "react"

import { useLocalStorageState } from "~/hooks/useLocalStorageState"

type SettingsContextType = {
  defaultResponse: string | null
  setDefaultResponse: (response: string) => void
  defaultUrl: string | null
  setDefaultUrl: (url: string) => void
  floatingButtonOpacity: number
  setFloatingButtonOpacity: (opacity: number) => void
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
  >("MSW_DEVTOOLS_DEFAULT_RESPONSE", null)

  const [defaultUrl, setDefaultUrl] = useLocalStorageState<string | null>(
    "MSW_DEVTOOLS_DEFAULT_URL",
    null
  )

  const [floatingButtonOpacity, setFloatingButtonOpacity] =
    useLocalStorageState<number>("MSW_DEVTOOLS_FLOATING_BUTTON_OPACITY", 1)

  const value = React.useMemo(
    () => ({
      defaultResponse,
      setDefaultResponse,
      defaultUrl,
      setDefaultUrl,
      floatingButtonOpacity,
      setFloatingButtonOpacity
    }),
    [
      defaultResponse,
      setDefaultResponse,
      defaultUrl,
      setDefaultUrl,
      floatingButtonOpacity,
      setFloatingButtonOpacity
    ]
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
