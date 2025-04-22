import { isSameJsonMock, type JsonMock } from "core"
import React, { useCallback, useEffect, useMemo } from "react"

import { StorageKey } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import { register, reset, unregister } from "~/lib/msw"
import {
  addServerMockListUpdateListener,
  sendMockListToServer
} from "~/lib/server"
import { formFieldValuesToJsonMock } from "~/utils/formFieldValuesToJsonMock"

export type MockListContextType = {
  mockList: JsonMock[]
  pushMock: (...mocks: JsonMock[]) => void
  removeMock: (...mocks: JsonMock[]) => void
  activateMock: (...mocks: JsonMock[]) => void
  deactivateMock: (...mocks: JsonMock[]) => void
  activatePromptMode: (...mocks: JsonMock[]) => void
  deactivatePromptMode: (...mocks: JsonMock[]) => void
  clearAllMocks: () => void
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

const sendMockListToServerMiddleware =
  (reducer: (prev: JsonMock[]) => JsonMock[]) => (prev: JsonMock[]) => {
    const mockList = reducer(prev)

    sendMockListToServer(mockList)

    return mockList
  }

export const MockListProvider = ({ children }: React.PropsWithChildren) => {
  const [mockList, setMockList] = useLocalStorageState(StorageKey.MOCK_LIST, [])
  const [editState, setEditStateLocal] = useLocalStorageState(
    StorageKey.EDIT_STATE,
    null
  )

  const pushMock: MockListContextType["pushMock"] = useCallback(
    (...mocks) => {
      setMockList(
        sendMockListToServerMiddleware((prev) => {
          register(...mocks)

          return [
            ...prev.filter((active) =>
              mocks.every((mock) => !isSameJsonMock(active, mock))
            ),
            ...mocks
          ]
        })
      )
    },
    [setMockList]
  )

  const removeMock: MockListContextType["removeMock"] = useCallback(
    (...mocksToRemove) => {
      setMockList(
        sendMockListToServerMiddleware((prev) =>
          unregister(prev, mocksToRemove)
        )
      )

      const currentEditState = editState && formFieldValuesToJsonMock(editState)
      if (
        currentEditState &&
        mocksToRemove.some((mock) => isSameJsonMock(mock, currentEditState))
      ) {
        setEditStateLocal(null)
      }
    },
    [setMockList, editState, setEditStateLocal]
  )

  const activateMock: MockListContextType["activateMock"] = useCallback(
    (...mocks) => {
      setMockList(
        sendMockListToServerMiddleware((prev) => {
          register(...mocks)

          return prev.map((active) => {
            const foundMock = mocks.find((mock) => isSameJsonMock(active, mock))

            const isActivated = foundMock ? true : active.isActivated

            return {
              ...active,
              isActivated
            }
          })
        })
      )
    },
    [setMockList]
  )

  const deactivateMock: MockListContextType["deactivateMock"] = useCallback(
    (...mocksToUnregister) => {
      setMockList(
        sendMockListToServerMiddleware((prev) => {
          unregister(prev, mocksToUnregister)

          return prev.map((active) => {
            const foundMock = mocksToUnregister.find((mockToUnregister) =>
              isSameJsonMock(active, mockToUnregister)
            )

            const isActivated = foundMock ? false : active.isActivated

            return {
              ...active,
              isActivated
            }
          })
        })
      )
    },
    [setMockList]
  )

  const activatePromptMode: MockListContextType["activatePromptMode"] =
    useCallback(
      (...mocks) => {
        setMockList(
          sendMockListToServerMiddleware((prev) => {
            register(...mocks)

            return prev.map((active) => {
              const foundMock = mocks.find((mock) =>
                isSameJsonMock(active, mock)
              )

              const shouldPromptResponse = foundMock
                ? true
                : active.shouldPromptResponse

              return {
                ...active,
                shouldPromptResponse
              }
            })
          })
        )
      },
      [setMockList]
    )

  const deactivatePromptMode: MockListContextType["deactivatePromptMode"] =
    useCallback(
      (...mocks) => {
        setMockList(
          sendMockListToServerMiddleware((prev) => {
            register(...mocks)

            return prev.map((active) => {
              const foundMock = mocks.find((mock) =>
                isSameJsonMock(active, mock)
              )

              const shouldPromptResponse = foundMock
                ? false
                : active.shouldPromptResponse

              return {
                ...active,
                shouldPromptResponse
              }
            })
          })
        )
      },
      [setMockList]
    )

  const clearAllMocks = useCallback(() => {
    setMockList(
      sendMockListToServerMiddleware((prev) => {
        unregister(prev, prev)

        return []
      })
    )
  }, [setMockList])

  useEffect(() => {
    const removeListener = addServerMockListUpdateListener((mockList) => {
      reset(mockList)
      setMockList(mockList)
    })

    return removeListener
  }, [setMockList])

  const value = useMemo(
    () => ({
      mockList,
      pushMock,
      removeMock,
      activateMock,
      deactivateMock,
      activatePromptMode,
      deactivatePromptMode,
      clearAllMocks
    }),
    [
      activateMock,
      deactivateMock,
      activatePromptMode,
      deactivatePromptMode,
      mockList,
      pushMock,
      removeMock,
      clearAllMocks
    ]
  )

  return (
    <MockListContext.Provider value={value}>
      {children}
    </MockListContext.Provider>
  )
}
