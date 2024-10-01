import {
  FIELD_NAME,
  type FormFieldResponseValue,
  type FormFieldValues
} from "~/constants"
import type { JsonMock, JsonMockResponse } from "~/types"

const parseResponse = (response: FormFieldResponseValue): JsonMockResponse => {
  if (response.type === "single") {
    return {
      type: "single",
      response: JSON.parse(response.response)
    }
  }

  return {
    type: "sequential",
    response: response.response.map((r) => JSON.parse(r))
  }
}

export const formFieldValuesToJsonMock = (
  formData: FormFieldValues
): JsonMock => {
  return {
    [FIELD_NAME.URL]: formData[FIELD_NAME.URL],
    [FIELD_NAME.METHOD]: formData[FIELD_NAME.METHOD],
    [FIELD_NAME.STATUS]: formData[FIELD_NAME.STATUS],
    [FIELD_NAME.RESPONSE]: parseResponse(formData[FIELD_NAME.RESPONSE]),
    isActivated: true,
    [FIELD_NAME.RESPONSE_DELAY]: formData[FIELD_NAME.RESPONSE_DELAY]
  }
}
