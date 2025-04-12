import { JsonMockResponseType } from "core"
import { useMemo } from "react"
import { Control, useWatch } from "react-hook-form"

import { FIELD_NAME, FormFieldValues } from "~/constants"
import { isJSONFixable } from "~/lib/json"

interface UseJsonValidationProps {
  control: Control<FormFieldValues>
}

/**
 * JSON 유효성 검사와 자동 수정을 담당하는 훅
 * - JSON 유효성 검사
 * - 자동 수정 가능 여부 확인
 * - 버튼 라벨 결정
 * - JSON 자동 수정 기능
 */
export function useJsonValidation({ control }: UseJsonValidationProps) {
  // 응답 값 감시
  const response = useWatch({
    control,
    name: FIELD_NAME.RESPONSE
  })

  // JSON 자동 수정 가능 여부 확인
  const isFixable = useMemo(() => {
    if (response.type === JsonMockResponseType.sequential) {
      return response.response.some(isJSONFixable)
    }

    return isJSONFixable(response.response)
  }, [response])

  // 제출 버튼 라벨 결정

  return {
    response,
    isFixable
  }
}
