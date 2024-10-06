import { isJsonMock } from "../guards"

describe("isJsonMock", () => {
  it("should return true if the data is a JsonMock", () => {
    const data = {
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

    expect(isJsonMock(data)).toBe(true)
  })

  it("should return false if the data is not a JsonMock", () => {
    const data = {}

    expect(isJsonMock(data)).toBe(false)
  })
})
