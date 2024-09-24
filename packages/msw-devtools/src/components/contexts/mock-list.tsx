import React, { useCallback, useMemo } from "react"

import { FIELD_NAME } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import { ACTIVATED_MOCK_LIST, register, unregister } from "~/lib/msw"
import type { JsonMock } from "~/types"

export type MockListContextType = {
  mockList: JsonMock[]
  pushMock: (...mocks: JsonMock[]) => void
  removeMock: (...mocks: JsonMock[]) => void
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

  const pushMock: MockListContextType["pushMock"] = useCallback(
    (...mocks) => {
      setMockList((prev) => {
        const nextMockList = [
          ...prev.filter((active) =>
            mocks.every(
              (mock) =>
                !(
                  active[FIELD_NAME.URL] === mock[FIELD_NAME.URL] &&
                  active[FIELD_NAME.METHOD] === mock[FIELD_NAME.METHOD]
                )
            )
          ),
          ...mocks
        ]

        register(...nextMockList)

        return nextMockList
      })
    },
    [setMockList]
  )

  const removeMock: MockListContextType["removeMock"] = useCallback(
    (mock) => {
      setMockList((prev) => {
        const nextMockList = prev.filter(
          (active) =>
            !(
              active[FIELD_NAME.URL] === mock[FIELD_NAME.URL] &&
              active[FIELD_NAME.METHOD] === mock[FIELD_NAME.METHOD]
            )
        )

        unregister(mock)

        return nextMockList
      })
    },
    [setMockList]
  )

  const value = useMemo(
    () => ({ mockList, pushMock, removeMock }),
    [mockList, pushMock, removeMock]
  )

  return (
    <MockListContext.Provider value={value}>
      {children}
    </MockListContext.Provider>
  )
}
