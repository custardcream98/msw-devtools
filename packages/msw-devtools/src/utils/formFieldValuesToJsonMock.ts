import {
  type JsonMock,
  type JsonMockResponse,
  JsonMockResponseType
} from "core"

import { type FormFieldResponseValue, type FormFieldValues } from "~/constants"

const parseResponse = (response: FormFieldResponseValue): JsonMockResponse => {
  if (response.type === JsonMockResponseType.single) {
    return {
      type: response.type,
      response: JSON.parse(response.response)
    }
  }

  return {
    type: response.type,
    response: response.response.map((r) => JSON.parse(r))
  }
}

export const formFieldValuesToJsonMock = (
  formData: FormFieldValues
): JsonMock => {
  return {
    url: formData.url,
    method: formData.method,
    status: formData.status,
    response: parseResponse(formData.response),
    isActivated: true,
    responseDelay: formData.responseDelay
  }
}
