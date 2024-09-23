import React, { useCallback, useMemo } from "react"

import { FIELD_NAME } from "~/constants"
import {
  getLocalStorageItem,
  useLocalStorageState
} from "~/hooks/useLocalStorageState"
import { ACTIVATED_MOCK_LIST } from "~/lib/msw"
import type { JsonMock } from "~/types"

export type ActivatedMockListContextType = {
  activatedMockList: JsonMock[]
  addActivatedMock: (activatedMock: JsonMock) => void
  reloadActivatedMockList: () => void
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
  >(ACTIVATED_MOCK_LIST, [])

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

  const reloadActivatedMockList = useCallback(() => {
    const localStorageMocks =
      getLocalStorageItem<JsonMock[]>(ACTIVATED_MOCK_LIST)

    if (!localStorageMocks || !Array.isArray(localStorageMocks)) {
      setActivatedMockList([])
      return
    }

    setActivatedMockList(localStorageMocks)
  }, [setActivatedMockList])

  const value = useMemo(
    () => ({ activatedMockList, addActivatedMock, reloadActivatedMockList }),
    [activatedMockList, addActivatedMock, reloadActivatedMockList]
  )

  return (
    <ActivatedMockListContext.Provider value={value}>
      {children}
    </ActivatedMockListContext.Provider>
  )
}
