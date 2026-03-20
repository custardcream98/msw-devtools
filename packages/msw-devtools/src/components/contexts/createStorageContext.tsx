import React, { useContext, useMemo } from "react"

import { StorageKey, StorageValueType } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"

/**
 * StorageKey에 기반한 Context Provider + Hook을 생성하는 팩토리 함수.
 * tuple 기반 API로 unsafe cast를 제거함.
 */
export function createStorageContext<Key extends StorageKey>(
  storageKey: Key,
  initialValue: StorageValueType[Key],
  displayName: string
) {
  const Context = React.createContext<
    | readonly [StorageValueType[Key], (value: StorageValueType[Key]) => void]
    | null
  >(null)
  Context.displayName = displayName

  const Provider = ({ children }: React.PropsWithChildren) => {
    const [storedValue, setStoredValue] = useLocalStorageState(
      storageKey,
      initialValue
    )

    const tuple = useMemo(
      () => [storedValue, setStoredValue] as const,
      [storedValue, setStoredValue]
    )

    return <Context value={tuple}>{children}</Context>
  }
  Provider.displayName = `${displayName}Provider`

  const useValue = () => {
    const context = useContext(Context)

    if (!context) {
      throw new Error(
        `[MSW Devtools] use${displayName} must be used within a ${displayName}Provider`
      )
    }

    return context
  }

  return { Context, Provider, useValue } as const
}
