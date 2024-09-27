import { useCallback, useState } from "react"

import { StorageKey, StorageValueType } from "~/constants"

const KEY = "MSW_DEVTOOLS"
const DEFAULT_STORAGE_VALUE = "{}"

export const getLocalStorageItem = <Key extends StorageKey>(
  key: Key
): StorageValueType[Key] | undefined => {
  return JSON.parse(window.localStorage.getItem(KEY) ?? DEFAULT_STORAGE_VALUE)[
    key
  ]
}

export const setLocalStorageItem = <Key extends StorageKey>(
  key: Key,
  value: StorageValueType[Key]
): void => {
  const prevStorage = JSON.parse(
    window.localStorage.getItem(KEY) ?? DEFAULT_STORAGE_VALUE
  )

  window.localStorage.setItem(
    KEY,
    JSON.stringify({
      ...prevStorage,
      [key]: value
    })
  )
}

export const useLocalStorageState = <Key extends StorageKey>(
  key: Key,
  initialValue: StorageValueType[Key]
): [
  StorageValueType[Key],
  React.Dispatch<React.SetStateAction<StorageValueType[Key]>>
] => {
  const [storedValue, setStoredValue] = useState<StorageValueType[Key]>(
    () => getLocalStorageItem(key) ?? initialValue
  )

  const setValue = useCallback(
    (value: React.SetStateAction<StorageValueType[Key]>) => {
      setStoredValue((prevValue) => {
        const finalValue =
          typeof value === "function" ? value(prevValue) : value

        setLocalStorageItem(key, finalValue)

        return finalValue
      })
    },
    [key]
  )

  return [storedValue, setValue]
}
