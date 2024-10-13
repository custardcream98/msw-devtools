import { type JsonMock } from "core"
import { HttpHandler } from "msw"

import { jsonMockListToHandlers } from "~/register"

describe("jsonMockListToHandlers", () => {
  it("should generate mock handlers from the JSON mock list", () => {
    const jsonMockList = [
      {
        url: "https://test-url",
        method: "get",
        status: "200",
        response: {
          type: "single",
          response: { name: "John" }
        },
        isActivated: true,
        responseDelay: 1000
      }
    ] satisfies JsonMock[]

    const result = jsonMockListToHandlers(jsonMockList)

    result.forEach((handler) => {
      expect(handler).toBeInstanceOf(HttpHandler)
    })
  })
})
