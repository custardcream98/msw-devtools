import type { JsonMock } from "@custardcream/msw-devtools-core"
import { http, HttpResponse } from "msw"

import { FIELD_NAME } from "~/constants"

export const generateHandler = (mock: JsonMock) => {
  let currentSequence = 0
  return http[mock[FIELD_NAME.METHOD]](mock[FIELD_NAME.URL], async () => {
    if (mock[FIELD_NAME.RESPONSE_DELAY] > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, mock[FIELD_NAME.RESPONSE_DELAY] * 1000)
      )
    }

    const response = mock[FIELD_NAME.RESPONSE]

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
      status: Number(mock[FIELD_NAME.STATUS])
    })
  })
}
