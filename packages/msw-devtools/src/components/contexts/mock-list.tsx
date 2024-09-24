import React, { useCallback, useMemo } from "react"

import { FIELD_NAME } from "~/constants"
import {
  getLocalStorageItem,
  useLocalStorageState
} from "~/hooks/useLocalStorageState"
import { ACTIVATED_MOCK_LIST } from "~/lib/msw"
import type { JsonMock } from "~/types"

export type MockListContextType = {
  mockList: JsonMock[]
  addMock: (mock: JsonMock) => void
  reloadMockList: () => void
}

export const MockListContext = React.createContext<MockListContextType | null>(
  null
)

export const useMockList = () => {
  const context = React.useContext(MockListContext)

  if (!context) {
    throw new Error("useMockList must be used within a MockListProvider")
  }

  return context
}

export const MockListProvider = ({ children }: React.PropsWithChildren) => {
  const [mockList, setMockList] = useLocalStorageState<JsonMock[]>(
    ACTIVATED_MOCK_LIST,
    []
  )

  const addMock: MockListContextType["addMock"] = useCallback(
    (mockToActivate) => {
      try {
        setMockList((prev) => {
          return [
            ...prev.filter(
              (active) =>
                active[FIELD_NAME.URL] !== mockToActivate[FIELD_NAME.URL] &&
                active[FIELD_NAME.METHOD] !== mockToActivate[FIELD_NAME.METHOD]
            ),
            mockToActivate
          ]
        })
      } catch (error) {
        alert(error)
      }
    },
    [setMockList]
  )

  const reloadMockList: MockListContextType["reloadMockList"] =
    useCallback(() => {
      const localStorageMocks =
        getLocalStorageItem<JsonMock[]>(ACTIVATED_MOCK_LIST)

      if (!localStorageMocks || !Array.isArray(localStorageMocks)) {
        setMockList([])
        return
      }

      setMockList(localStorageMocks)
    }, [setMockList])

  const value = useMemo(
    () => ({ mockList, addMock, reloadMockList }),
    [mockList, addMock, reloadMockList]
  )

  return (
    <MockListContext.Provider value={value}>
      {children}
    </MockListContext.Provider>
  )
}
