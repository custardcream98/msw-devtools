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
 * 폼 상태의 지속성을 관리하는 훅
 * - 로컬 스토리지에 폼 상태 저장
 * - 언마운트 시 자동 저장
 * - 폼 초기화 지원
 */
export function useFormPersistence({
  method,
  defaultValues
}: UseFormPersistenceProps) {
  // 편집 상태 관리
  const [editStateLocal, setEditStateLocal] = useLocalStorageState(
    StorageKey.EDIT_STATE,
    null
  )

  // 폼 상태 저장 (언마운트 시)
  useEffect(() => {
    return () => {
      const currentValues = method.getValues()
      const isEdit = getLocalStorageItem(StorageKey.EDIT_STATE)

      if (isEdit) {
        setEditStateLocal(currentValues)
        return
      }

      // 기본값과 다를 경우에만 저장
      if (
        currentValues &&
        !isSameFormFieldValues(currentValues, defaultValues)
      ) {
        setLocalStorageItem(StorageKey.SAVED_FORM_FIELD_VALUES, currentValues)
      }
    }
  }, [method, defaultValues, setEditStateLocal])

  // 폼과 저장소 모두 초기화
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
