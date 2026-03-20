import { JsonMockResponseType } from "core"
import { jsonrepair } from "jsonrepair"

import { FormFieldResponseValue } from "~/constants"
import { checkJSONFixable, checkJSONParsable, isJSONFixable } from "~/lib/json"

export const VALIDATION_RESULT = {
  VALID: true,
  INVALID: false,
  FIXABLE: "FIXABLE"
} as const

export type ValidationResult = boolean | typeof VALIDATION_RESULT.FIXABLE

export const validate = (value: string): ValidationResult => {
  if (!value) {
    return false
  }

  if (checkJSONParsable(value)) {
    return true
  }

  if (checkJSONFixable(value)) {
    return VALIDATION_RESULT.FIXABLE
  }

  return false
}

export const fixJson = (
  responseValue: FormFieldResponseValue
): FormFieldResponseValue => {
  if (responseValue.type === JsonMockResponseType.sequential) {
    return {
      type: responseValue.type,
      response: responseValue.response.map((value) =>
        isJSONFixable(value) ? jsonrepair(value) : value
      )
    }
  }

  return {
    type: JsonMockResponseType.single,
    response: jsonrepair(responseValue.response)
  }
}
