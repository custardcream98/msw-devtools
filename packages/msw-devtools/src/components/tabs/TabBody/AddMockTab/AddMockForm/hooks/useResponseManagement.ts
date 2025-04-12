import { JsonMockResponseType } from "core"
import { useCallback } from "react"
import { UseFormReturn } from "react-hook-form"

import {
  FIELD_NAME,
  FormFieldResponseValue,
  FormFieldValues
} from "~/constants"

interface UseResponseManagementProps {
  method: UseFormReturn<FormFieldValues>
  defaultValues: FormFieldValues
}

/**
 * 응답 데이터 정규화 함수
 * - 단일 응답을 배열로 변환
 * - 순차 응답은 그대로 반환
 */
export function normalizeResponse(response: FormFieldResponseValue): string[] {
  return response.type === JsonMockResponseType.sequential
    ? response.response
    : [response.response]
}

/**
 * 응답 데이터 관리를 담당하는 훅
 * - 순차 응답 추가 기능
 */
export function useResponseManagement({
  method,
  defaultValues
}: UseResponseManagementProps) {
  /**
   * 순차 응답 추가
   * - 현재 응답에 기본 응답을 추가
   */
  const addSequentialResponse = useCallback(() => {
    const normalizedPrevResponse = normalizeResponse(
      method.getValues(FIELD_NAME.RESPONSE)
    )
    const normalizedDefaultResponse = normalizeResponse(
      defaultValues[FIELD_NAME.RESPONSE]
    )

    const nextResponse: FormFieldResponseValue = {
      type: JsonMockResponseType.sequential,
      response: [...normalizedPrevResponse, ...normalizedDefaultResponse]
    }

    method.setValue(FIELD_NAME.RESPONSE, nextResponse, {
      shouldValidate: true
    })
  }, [defaultValues, method])

  return {
    addSequentialResponse
  }
}
