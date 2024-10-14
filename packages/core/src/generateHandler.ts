import { http, type HttpHandler, HttpResponse } from "msw"

import { JsonMockResponseType } from "./constants"
import type { JsonMock } from "./types"

export const generateHandler = (mock: JsonMock): HttpHandler => {
  let currentSequence = 0
  return http[mock.method](mock.url, async () => {
    if (mock.responseDelay > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, mock.responseDelay * 1000)
      )
    }

    const response = mock.response

    const resolvedResponse =
      response.type === JsonMockResponseType.sequential
        ? response.response[currentSequence]
        : response.response

    if (response.type === JsonMockResponseType.sequential) {
      currentSequence =
        currentSequence === response.response.length - 1
          ? 0
          : currentSequence + 1
    }

    return HttpResponse.json(resolvedResponse, {
      status: Number(mock.status)
    })
  })
}
