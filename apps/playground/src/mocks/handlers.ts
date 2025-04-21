import { http, HttpResponse } from "msw"

import { ENDPOINT } from "../constants"

export const handlers = [
  http.get(ENDPOINT, () => {
    return HttpResponse.json("sweet")
  })
]
