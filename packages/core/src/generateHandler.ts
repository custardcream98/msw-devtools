import { http, HttpResponse } from "msw"

import type { JsonMock } from "./types"

export const generateHandler = (mock: JsonMock) => {
  let currentSequence = 0
  return http[mock.method](mock.url, async () => {
    if (mock.responseDelay > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, mock.responseDelay * 1000)
      )
    }

    const response = mock.response

    const resolvedResponse =
      response.type === "sequential"
        ? response.response[currentSequence]
        : response.response

    if (response.type === "sequential") {
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
