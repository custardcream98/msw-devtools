import { useCallback, useEffect } from "react"
import { UseFormReturn } from "react-hook-form"

import { FormFieldValues, StorageKey } from "~/constants"
import {
  getLocalStorageItem,
  setLocalStorageItem,
  useLocalStorageState
} from "~/hooks/useLocalStorageState"
import { isSameFormFieldValues } from "~/utils/isSameFormFieldValues"

interface UseFormPersistenceProps {
  method: UseFormReturn<FormFieldValues>
  defaultValues: FormFieldValues
}

/**
 * Hook to manage form state persistence
 * - Saves form state to local storage
 * - Automatically saves on unmount
 * - Supports form reset
 */
export function useFormPersistence({
  method,
  defaultValues
}: UseFormPersistenceProps) {
  // Manage edit state
  const [editStateLocal, setEditStateLocal] = useLocalStorageState(
    StorageKey.EDIT_STATE,
    null
  )

  // Save form state (on unmount)
  useEffect(() => {
    return () => {
      const currentValues = method.getValues()
      const isEdit = getLocalStorageItem(StorageKey.EDIT_STATE)

      if (isEdit) {
        setEditStateLocal(currentValues)
        return
      }

      // Only save if different from default values
      if (
        currentValues &&
        !isSameFormFieldValues(currentValues, defaultValues)
      ) {
        setLocalStorageItem(StorageKey.SAVED_FORM_FIELD_VALUES, currentValues)
      }
    }
  }, [method, defaultValues, setEditStateLocal])

  // Reset form and storage
  const resetForm = useCallback(() => {
    setLocalStorageItem(StorageKey.SAVED_FORM_FIELD_VALUES, null)
    setEditStateLocal(null)

    method.reset(defaultValues)
  }, [setEditStateLocal, method, defaultValues])

  return {
    isEdit: !!editStateLocal,
    resetForm
  }
}
