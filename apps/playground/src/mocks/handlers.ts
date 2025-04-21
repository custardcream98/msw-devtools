import { http, HttpResponse } from "msw"

import { ENDPOINT } from "../constants"

export const handlers = [
  // Get all todos
  http.get(ENDPOINT, () => {
    return HttpResponse.json("sweet")
  })
]
