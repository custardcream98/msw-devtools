import type { JsonMock } from "core"

import { autoFixJsonMock } from "~/utils/autoFixJsonMock"

describe("autoFixJsonMock", () => {
  it("should auto fix the JSON mock", () => {
    const jsonMockFixable = {
      url: "https://test-url",
      method: "Get",
      status: 200,
      response: null,
      responseDelay: "1000",
      isActivated: true
    } as const

    expect(autoFixJsonMock(jsonMockFixable)).toStrictEqual({
      url: "https://test-url",
      method: "get",
      status: "200",
      response: {
        type: "single",
        response: null
      },
      responseDelay: 1000,
      isActivated: true,
      shouldPromptResponse: false
    } as const satisfies JsonMock)
  })
})
