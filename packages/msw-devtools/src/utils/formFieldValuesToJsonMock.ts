import type { JsonMock, JsonMockResponse } from "core"

import { type FormFieldResponseValue, type FormFieldValues } from "~/constants"

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
    url: formData.url,
    method: formData.method,
    status: formData.status,
    response: parseResponse(formData.response),
    isActivated: true,
    responseDelay: formData.responseDelay
  }
}
