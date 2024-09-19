import React, { useCallback, useMemo, useState } from "react"

import {
  FIELD_NAME,
  FormFieldValues
} from "~/components/TabBody/AddMockTab/AddMockForm/form"

export type ActivatedMockListContextType = {
  activatedMockList: FormFieldValues[]
  addActivatedMock: (activatedMock: FormFieldValues) => void
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
  const [activatedMockList, setActivatedMockList] = useState<FormFieldValues[]>(
    []
  )

  const addActivatedMock = useCallback((activatedMock: FormFieldValues) => {
    setActivatedMockList((prev) => {
      return [
        ...prev.filter(
          (active) => active[FIELD_NAME.URL] !== activatedMock[FIELD_NAME.URL]
        ),
        activatedMock
      ]
    })
  }, [])

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
