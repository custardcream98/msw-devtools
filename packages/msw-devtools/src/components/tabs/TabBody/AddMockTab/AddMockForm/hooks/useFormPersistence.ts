import { useCallback, useEffect } from "react"
import { UseFormReturn } from "react-hook-form"

import { useEditState } from "~/components/contexts/edit-state"
import { FormFieldValues, StorageKey } from "~/constants"
import {
  getLocalStorageItem,
  setLocalStorageItem
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
  // editState는 EditStateContext의 Single Source of Truth에서 관리
  const { editState, setEditState } = useEditState()

  // Save form state (on unmount)
  useEffect(() => {
    return () => {
      const currentValues = method.getValues()
      const isEdit = getLocalStorageItem(StorageKey.EDIT_STATE)

      if (isEdit) {
        setEditState(currentValues)
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
  }, [method, defaultValues, setEditState])

  // Reset form and storage
  const resetForm = useCallback(() => {
    setLocalStorageItem(StorageKey.SAVED_FORM_FIELD_VALUES, null)
    setEditState(null)

    method.reset(defaultValues)
  }, [setEditState, method, defaultValues])

  return {
    isEdit: !!editState,
    resetForm
  }
}
