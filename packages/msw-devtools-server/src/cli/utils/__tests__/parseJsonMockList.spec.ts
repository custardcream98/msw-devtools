import type { JsonMock } from "core"

import { parseJsonMockList } from "~/cli/utils/parseJsonMockList"

describe("parseJsonMockList", () => {
  it("should parse the JSON mock list", () => {
    const raw = JSON.stringify([
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
      } satisfies JsonMock
    ])

    expect(parseJsonMockList(raw)).toStrictEqual([
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
    ])
  })

  it("should throw an error on invalid JSON mock list", () => {
    const raw = JSON.stringify({
      url: "https://test-url",
      method: "get",
      status: "200",
      response: {
        type: "single",
        response: { name: "John" }
      },
      isActivated: true,
      responseDelay: 1000
    })

    expect(() => parseJsonMockList(raw)).toThrow("Invalid JSON mock list")
  })
})
