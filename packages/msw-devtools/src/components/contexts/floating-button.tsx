import React, { useContext, useMemo } from "react"

import { StorageKey } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"

type FloatingButtonSettingsContextType = {
  floatingButtonOpacity: number
  setFloatingButtonOpacity: (opacity: number) => void
}

export const FloatingButtonSettingsContext =
  React.createContext<FloatingButtonSettingsContextType | null>(null)

export const useFloatingButtonSettings = () => {
  const context = useContext(FloatingButtonSettingsContext)

  if (!context) {
    throw new Error(
      "[MSW Devtools] useFloatingButtonSettings must be used within a FloatingButtonSettingsProvider"
    )
  }

  return context
}

export const FloatingButtonSettingsProvider = ({
  children
}: React.PropsWithChildren) => {
  const [floatingButtonOpacity, setFloatingButtonOpacity] =
    useLocalStorageState(StorageKey.FLOATING_BUTTON_OPACITY, 1)

  const value = useMemo(
    () => ({
      floatingButtonOpacity,
      setFloatingButtonOpacity
    }),
    [floatingButtonOpacity, setFloatingButtonOpacity]
  )

  return (
    <FloatingButtonSettingsContext.Provider value={value}>
      {children}
    </FloatingButtonSettingsContext.Provider>
  )
}
