import { http, HttpResponse } from "msw"

export const handlers = [
  // Get all todos
  http.get("/api/custard-status", () => {
    return HttpResponse.json("sweet")
  })
]
