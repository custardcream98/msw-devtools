import type {
  JsonMock,
  JsonMockResponse
} from "@custardcream/msw-devtools-core"

import {
  FIELD_NAME,
  FormFieldResponseValue,
  type FormFieldValues
} from "~/constants"

export const jsonMockToFormFieldValues = (
  jsonMock: JsonMock
): FormFieldValues => {
  return {
    [FIELD_NAME.URL]: jsonMock.url,
    [FIELD_NAME.METHOD]: jsonMock.method,
    [FIELD_NAME.STATUS]: jsonMock.status,
    [FIELD_NAME.RESPONSE]: resolveResponse(jsonMock.response),
    [FIELD_NAME.RESPONSE_DELAY]: jsonMock.responseDelay
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
