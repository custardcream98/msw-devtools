import { isJsonMock, isMSWDevtoolsWebsocketEvent } from "../guards"

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

describe("isMSWDevtoolsWebsocketEvent", () => {
  it("should return true if the event is a MSWDevtoolsWebsocketEvent", () => {
    const event = { name: "msw-devtools:syn" }

    expect(isMSWDevtoolsWebsocketEvent(event)).toBe(true)

    const event2 = {
      name: "msw-devtools:mock-list:update",
      payload: [
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
      ]
    }

    expect(isMSWDevtoolsWebsocketEvent(event2)).toBe(true)

    const event3 = {
      name: "msw-devtools:ack",
      payload: [
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
      ]
    }

    expect(isMSWDevtoolsWebsocketEvent(event3)).toBe(true)
  })

  it("should return false if the event is not a MSWDevtoolsWebsocketEvent", () => {
    const event = {}

    expect(isMSWDevtoolsWebsocketEvent(event)).toBe(false)
  })
})
