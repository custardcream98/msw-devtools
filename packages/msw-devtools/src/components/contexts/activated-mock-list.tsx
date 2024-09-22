import React, { useCallback, useMemo } from "react"

import { FIELD_NAME } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import { MSW_DEVTOOLS_ACTIVATED_MOCK_LIST } from "~/lib/msw"
import type { JsonMock } from "~/types"

export type ActivatedMockListContextType = {
  activatedMockList: JsonMock[]
  addActivatedMock: (activatedMock: JsonMock) => void
}

export const ActivatedMockListContext =
  React.createContext<ActivatedMockListContextType | null>(null)

export const useActivatedMockList = () => {
  const context = React.useContext(ActivatedMockListContext)

  if (!context) {
    throw new Error(
      "useActivatedMockList must be used within a ActivatedMockListProvider"
    )
  }

  return context
}

export const ActivatedMockListProvider = ({
  children
}: React.PropsWithChildren) => {
  const [activatedMockList, setActivatedMockList] = useLocalStorageState<
    JsonMock[]
  >(MSW_DEVTOOLS_ACTIVATED_MOCK_LIST, [])

  const addActivatedMock = useCallback(
    (mockToActivate: JsonMock) => {
      try {
        setActivatedMockList((prev) => {
          return [
            ...prev.filter(
              (active) =>
                active[FIELD_NAME.URL] !== mockToActivate[FIELD_NAME.URL]
            ),
            mockToActivate
          ]
        })
      } catch (error) {
        alert(error)
      }
    },
    [setActivatedMockList]
  )

  const value = useMemo(
    () => ({ activatedMockList, addActivatedMock }),
    [activatedMockList, addActivatedMock]
  )

  return (
    <ActivatedMockListContext.Provider value={value}>
      {children}
    </ActivatedMockListContext.Provider>
  )
}
