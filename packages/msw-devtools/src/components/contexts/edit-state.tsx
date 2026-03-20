import { isSameJsonMock } from "core"
import React, { useEffect, useMemo } from "react"

import { FormFieldValues, StorageKey } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import { formFieldValuesToJsonMock } from "~/utils/formFieldValuesToJsonMock"

import { useMockList } from "./mock-list"

export type EditStateContextType = {
  editState: FormFieldValues | null
  setEditState: (editState: FormFieldValues | null) => void
}

const EditStateContext = React.createContext<EditStateContextType | null>(null)

export const useEditState = () => {
  const context = React.useContext(EditStateContext)

  if (!context) {
    throw new Error(
      "[MSW Devtools] useEditState must be used within an EditStateProvider"
    )
  }

  return context
}

export const EditStateProvider = ({ children }: React.PropsWithChildren) => {
  const [editState, setEditState] = useLocalStorageState(
    StorageKey.EDIT_STATE,
    null
  )
  const { mockList } = useMockList()

  // removeMock 후 편집 대상이 목록에서 사라졌으면 editState를 초기화
  useEffect(() => {
    if (!editState) return

    const editMock = formFieldValuesToJsonMock(editState)
    const isEditTargetInList = mockList.some((m) => isSameJsonMock(m, editMock))
    if (!isEditTargetInList) {
      setEditState(null)
    }
  }, [mockList, editState, setEditState])

  const editStateValue = useMemo(
    () => ({
      editState,
      setEditState
    }),
    [editState, setEditState]
  )

  return <EditStateContext value={editStateValue}>{children}</EditStateContext>
}
