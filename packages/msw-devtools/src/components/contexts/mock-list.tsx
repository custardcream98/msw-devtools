import { isSameJsonMock, type JsonMock } from "core"
import React, { useCallback, useEffect, useMemo } from "react"

import { StorageKey } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import { register, reset, unregister } from "~/lib/msw"
import {
  addServerMockListUpdateListener,
  sendMockListToServer
} from "~/lib/server"

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

/** boolean 프로퍼티 토글 시 사용할 side-effect 타입 */
type SideEffect = "register-matched" | "unregister-matched" | "register-all"

export const MockListProvider = ({ children }: React.PropsWithChildren) => {
  const [mockList, setMockList] = useLocalStorageState(StorageKey.MOCK_LIST, [])

  /** setMockList + sendMockListToServer를 한 번에 처리하는 래퍼 */
  const setMockListWithSync = useCallback(
    (reducer: (prev: JsonMock[]) => JsonMock[]) => {
      setMockList((prev) => {
        const next = reducer(prev)
        sendMockListToServer(next)
        return next
      })
    },
    [setMockList]
  )

  /** boolean 프로퍼티를 토글하는 범용 함수 */
  const toggleMockProperty = useCallback(
    (
      property: "isActivated" | "shouldPromptResponse",
      value: boolean,
      sideEffect: SideEffect,
      ...mocks: JsonMock[]
    ) => {
      setMockListWithSync((prev) => {
        const nextMocks = prev.map((item) => {
          const found = mocks.find((mock) => isSameJsonMock(item, mock))
          return found ? { ...item, [property]: value } : item
        })
        switch (sideEffect) {
          case "register-matched":
            register(...mocks)
            break
          case "unregister-matched":
            unregister(prev, mocks)
            break
          case "register-all":
            register(...nextMocks)
            break
        }
        return nextMocks
      })
    },
    [setMockListWithSync]
  )

  const pushMock: MockListContextType["pushMock"] = useCallback(
    (...mocks) => {
      setMockListWithSync((prev) => {
        register(...mocks)
        return [
          ...prev.filter((active) =>
            mocks.every((mock) => !isSameJsonMock(active, mock))
          ),
          ...mocks
        ]
      })
    },
    [setMockListWithSync]
  )

  const removeMock: MockListContextType["removeMock"] = useCallback(
    (...mocksToRemove) => {
      setMockListWithSync((prev) => unregister(prev, mocksToRemove))
    },
    [setMockListWithSync]
  )

  // toggleMockProperty를 호출하는 경량 래퍼 (useCallback 불필요)
  const activateMock = (...mocks: JsonMock[]) =>
    toggleMockProperty("isActivated", true, "register-matched", ...mocks)
  const deactivateMock = (...mocks: JsonMock[]) =>
    toggleMockProperty("isActivated", false, "unregister-matched", ...mocks)
  const activatePromptMode = (...mocks: JsonMock[]) =>
    toggleMockProperty("shouldPromptResponse", true, "register-all", ...mocks)
  const deactivatePromptMode = (...mocks: JsonMock[]) =>
    toggleMockProperty("shouldPromptResponse", false, "register-all", ...mocks)

  const clearAllMocks = useCallback(() => {
    setMockListWithSync((prev) => {
      unregister(prev, prev)
      return []
    })
  }, [setMockListWithSync])

  useEffect(() => {
    const removeListener = addServerMockListUpdateListener((mockList) => {
      reset(mockList)
      setMockList(mockList)
    })
    return removeListener
  }, [setMockList])

  const mockListValue = useMemo(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 경량 래퍼는 toggleMockProperty에 의존
    [mockList, pushMock, removeMock, toggleMockProperty, clearAllMocks]
  )

  return <MockListContext value={mockListValue}>{children}</MockListContext>
}
