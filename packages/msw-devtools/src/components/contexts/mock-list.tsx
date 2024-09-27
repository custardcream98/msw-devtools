import React, { useCallback, useMemo } from "react"

import { StorageKey } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import { register, unregister } from "~/lib/msw"
import type { JsonMock } from "~/types"
import { formFieldValuesToJsonMock } from "~/utils/formFieldValuesToJsonMock"
import { isSameMockJson } from "~/utils/isSameMockJson"

export type MockListContextType = {
  mockList: JsonMock[]
  pushMock: (...mocks: JsonMock[]) => void
  removeMock: (...mocks: JsonMock[]) => void
  activateMock: (...mocks: JsonMock[]) => void
  deactivateMock: (...mocks: JsonMock[]) => void
}

const MockListContext = React.createContext<MockListContextType | null>(null)

export const useMockList = () => {
  const context = React.useContext(MockListContext)

  if (!context) {
    throw new Error(
      "[MSW Devtools] useMockList must be used within a MockListProvider"
    )
  }

  return context
}

export const MockListProvider = ({ children }: React.PropsWithChildren) => {
  const [mockList, setMockList] = useLocalStorageState(StorageKey.MOCK_LIST, [])
  const [editState, setEditStateLocal] = useLocalStorageState(
    StorageKey.EDIT_STATE,
    null
  )

  const pushMock: MockListContextType["pushMock"] = useCallback(
    (...mocks) => {
      setMockList((prev) => {
        register(...mocks)

        return [
          ...prev.filter((active) =>
            mocks.every((mock) => !isSameMockJson(active, mock))
          ),
          ...mocks
        ]
      })
    },
    [setMockList]
  )

  const removeMock: MockListContextType["removeMock"] = useCallback(
    (...mocksToRemove) => {
      setMockList((prev) => {
        const nextMockList = unregister(prev, mocksToRemove)

        return nextMockList
      })

      const currentEditState = editState && formFieldValuesToJsonMock(editState)
      if (
        currentEditState &&
        mocksToRemove.some((mock) => isSameMockJson(mock, currentEditState))
      ) {
        setEditStateLocal(null)
      }
    },
    [setMockList, editState, setEditStateLocal]
  )

  const activateMock: MockListContextType["activateMock"] = useCallback(
    (...mocks) => {
      setMockList((prev) => {
        register(...mocks)

        return prev.map((active) => {
          const foundMock = mocks.find((mock) => isSameMockJson(active, mock))

          const isActivated = foundMock ? true : active.isActivated

          return {
            ...active,
            isActivated
          }
        })
      })
    },
    [setMockList]
  )

  const deactivateMock: MockListContextType["deactivateMock"] = useCallback(
    (...mocksToUnregister) => {
      setMockList((prev) => {
        unregister(prev, mocksToUnregister)

        return prev.map((active) => {
          const foundMock = mocksToUnregister.find((mockToUnregister) =>
            isSameMockJson(active, mockToUnregister)
          )

          const isActivated = foundMock ? false : active.isActivated

          return {
            ...active,
            isActivated
          }
        })
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
