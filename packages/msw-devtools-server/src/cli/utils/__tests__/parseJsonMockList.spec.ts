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
        responseDelay: 1000,
        shouldPromptResponse: true
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
        responseDelay: 1000,
        shouldPromptResponse: true
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
      responseDelay: 1000,
      shouldPromptResponse: true
    })

    expect(() => parseJsonMockList(raw)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid JSON mock list]`
    )
  })
})
