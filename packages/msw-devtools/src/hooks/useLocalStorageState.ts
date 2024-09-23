import { useCallback, useState } from "react"

const KEY = "MSW_DEVTOOLS"
const DEFAULT_STORAGE_VALUE = "{}"

export const getLocalStorageItem = <
  T extends boolean | object | string | number | null
>(
  key: string
): T | undefined => {
  return JSON.parse(window.localStorage.getItem(KEY) ?? DEFAULT_STORAGE_VALUE)[
    key
  ]
}

export const setLocalStorageItem = <
  T extends boolean | object | string | number | null
>(
  key: string,
  value: T
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

export const useLocalStorageState = <
  T extends boolean | object | string | number | null
>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(
    () => getLocalStorageItem<T>(key) ?? initialValue
  )

  const setValue = useCallback(
    (value: React.SetStateAction<T>) => {
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
