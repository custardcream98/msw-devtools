import { useCallback, useEffect, useState } from "react"

export const useLocalStorageState = <
  T extends boolean | object | string | number | null
>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: React.SetStateAction<T>) => {
      setStoredValue((prevValue) => {
        const finalValue =
          typeof value === "function" ? value(prevValue) : value

        window.localStorage.setItem(key, JSON.stringify(finalValue))

        return finalValue
      })
    },
    [key]
  )

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setStoredValue(JSON.parse(event.newValue ?? "null"))
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [key])

  return [storedValue, setValue]
}
