import {
  type JsonMock,
  type JsonMockResponse,
  JsonMockResponseType
} from "core"

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
    [FIELD_NAME.RESPONSE_DELAY]: jsonMock.responseDelay,
    [FIELD_NAME.SHOULD_PROMPT_RESPONSE]: jsonMock.shouldPromptResponse
  }
}

const resolveResponse = (
  response: JsonMockResponse
): FormFieldResponseValue => {
  if (response.type === JsonMockResponseType.single) {
    return {
      type: response.type,
      response: JSON.stringify(response.response, null, 2)
    }
  }

  return {
    type: response.type,
    response: response.response.map((r) => JSON.stringify(r, null, 2))
  }
}
