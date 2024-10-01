import {
  FIELD_NAME,
  FormFieldResponseValue,
  type FormFieldValues
} from "~/constants"
import type { JsonMock, JsonMockResponse } from "~/types"

export const jsonMockToFormFieldValues = (
  jsonMock: JsonMock
): FormFieldValues => {
  return {
    [FIELD_NAME.URL]: jsonMock[FIELD_NAME.URL],
    [FIELD_NAME.METHOD]: jsonMock[FIELD_NAME.METHOD],
    [FIELD_NAME.STATUS]: jsonMock[FIELD_NAME.STATUS],
    [FIELD_NAME.RESPONSE]: resolveResponse(jsonMock[FIELD_NAME.RESPONSE]),
    [FIELD_NAME.RESPONSE_DELAY]: jsonMock[FIELD_NAME.RESPONSE_DELAY]
  }
}

const resolveResponse = (
  response: JsonMockResponse
): FormFieldResponseValue => {
  if (response.type === "single") {
    return {
      type: "single",
      response: JSON.stringify(response.response, null, 2)
    }
  }

  return {
    type: "sequential",
    response: response.response.map((r) => JSON.stringify(r, null, 2))
  }
}
