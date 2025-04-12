import { JsonMockResponseType } from "core"
import { useMemo } from "react"

import { type FormFieldResponseValue } from "~/constants"
import { isJSONFixable } from "~/lib/json"

interface UseJsonValidationProps {
  response: FormFieldResponseValue
}

export function useJsonValidation({ response }: UseJsonValidationProps) {
  const isFixable = useMemo(() => {
    if (response.type === JsonMockResponseType.sequential) {
      return response.response.some(isJSONFixable)
    }

    return isJSONFixable(response.response)
  }, [response])

  return {
    response,
    isFixable
  }
}
