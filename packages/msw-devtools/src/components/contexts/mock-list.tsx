import React, { useCallback, useMemo } from "react"

import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import { MOCK_LIST, register, unregister } from "~/lib/msw"
import type { JsonMock } from "~/types"
import { isSameMockJson } from "~/utils/isSameMockJson"

export type MockListContextType = {
  mockList: JsonMock[]
  pushMock: (...mocks: JsonMock[]) => void
  removeMock: (...mocks: JsonMock[]) => void
  activateMock: (...mocks: JsonMock[]) => void
  deactivateMock: (...mocks: JsonMock[]) => void
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
    MOCK_LIST,
    []
  )

  const pushMock: MockListContextType["pushMock"] = useCallback(
    (...mocks) => {
      setMockList((prev) => {
        const nextMockList = [
          ...prev.filter((active) =>
            mocks.every((mock) => !isSameMockJson(active, mock))
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
    (...mocks) => {
      setMockList((prev) => {
        const nextMockList = prev.filter((active) =>
          mocks.every((mock) => !isSameMockJson(active, mock))
        )

        unregister(...mocks)

        return nextMockList
      })
    },
    [setMockList]
  )

  const activateMock: MockListContextType["activateMock"] = useCallback(
    (...mocks) => {
      setMockList((prev) => {
        const nextMockList = prev.map((active) => {
          const foundMock = mocks.find((mock) => isSameMockJson(active, mock))

          const isActivated = foundMock ? true : active.isActivated

          return {
            ...active,
            isActivated
          }
        })

        register(...mocks)

        return nextMockList
      })
    },
    [setMockList]
  )

  const deactivateMock: MockListContextType["deactivateMock"] = useCallback(
    (...mocks) => {
      setMockList((prev) => {
        const nextMockList = prev.map((active) => {
          const foundMock = mocks.find((mock) => isSameMockJson(active, mock))

          const isActivated = foundMock ? false : active.isActivated

          return {
            ...active,
            isActivated
          }
        })

        unregister(...mocks)

        return nextMockList
      })
    },
    [setMockList]
  )

  const value = useMemo(
    () => ({ mockList, pushMock, removeMock, activateMock, deactivateMock }),
    [activateMock, deactivateMock, mockList, pushMock, removeMock]
  )

  return (
    <MockListContext.Provider value={value}>
      {children}
    </MockListContext.Provider>
  )
}
