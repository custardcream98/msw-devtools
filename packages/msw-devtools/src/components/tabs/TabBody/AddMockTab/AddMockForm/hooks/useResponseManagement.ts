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
 * Response data normalization function
 * - Converts single response to array
 * - Returns sequential responses as-is
 */
export function normalizeResponse(response: FormFieldResponseValue): string[] {
  return response.type === JsonMockResponseType.sequential
    ? response.response
    : [response.response]
}

/**
 * Hook for response data management
 * - Provides sequential response addition functionality
 */
export function useResponseManagement({
  method,
  defaultValues
}: UseResponseManagementProps) {
  /**
   * Add sequential response
   * - Adds default response to current response
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
