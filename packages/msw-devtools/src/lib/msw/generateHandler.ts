import { http, HttpResponse } from "msw"

import { FIELD_NAME } from "~/constants"
import type { JsonMock } from "~/types"

export const generateHandler = (mock: JsonMock) => {
  return http[mock[FIELD_NAME.METHOD]](mock[FIELD_NAME.URL], async () => {
    if (mock[FIELD_NAME.RESPONSE_DELAY] > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, mock[FIELD_NAME.RESPONSE_DELAY] * 1000)
      )
    }

    return HttpResponse.json(mock[FIELD_NAME.RESPONSE], {
      status: Number(mock[FIELD_NAME.STATUS])
    })
  })
}
