import type { JsonMock } from "core"

import { isSameJsonMock } from "~/utils/isSameJsonMock"

describe("isSameJsonMock", () => {
  it("should return true if the two JsonMock objects are the same", () => {
    const a: JsonMock = {
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
    const b: JsonMock = {
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

    const result = isSameJsonMock(a, b)

    expect(result).toBe(true)
  })

  it("should return false if the two JsonMock objects are different", () => {
    const a: JsonMock = {
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
    const b: JsonMock = {
      url: "https://test-url",
      method: "put",
      status: "200",
      response: {
        type: "single",
        response: { name: "John" }
      },
      isActivated: true,
      responseDelay: 1000
    }

    const result = isSameJsonMock(a, b)

    expect(result).toBe(false)
  })
})
