import { MSWDevtoolsClientType } from "../constants"
import { isJsonMock, isMSWDevtoolsWebsocketEvent } from "../guards"
import type { MSWDevtoolsWebsocketEvent } from "../types"

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
    const syn: MSWDevtoolsWebsocketEvent = {
      name: "msw-devtools:syn",
      payload: MSWDevtoolsClientType.CLIENT
    }

    expect(isMSWDevtoolsWebsocketEvent(syn)).toBe(true)

    const mockListUpdate: MSWDevtoolsWebsocketEvent = {
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

    expect(isMSWDevtoolsWebsocketEvent(mockListUpdate)).toBe(true)

    const ack: MSWDevtoolsWebsocketEvent = {
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

    expect(isMSWDevtoolsWebsocketEvent(ack)).toBe(true)

    const ack2: MSWDevtoolsWebsocketEvent = {
      name: "msw-devtools:ack",
      payload: null
    }

    expect(isMSWDevtoolsWebsocketEvent(ack2)).toBe(true)
  })

  it("should return false if the event is not a MSWDevtoolsWebsocketEvent", () => {
    const event = {}

    expect(isMSWDevtoolsWebsocketEvent(event)).toBe(false)

    const syn = {
      name: "msw-devtools:syn"
    }

    expect(isMSWDevtoolsWebsocketEvent(syn)).toBe(false)

    const syn2 = {
      name: "msw-devtools:syn",
      payload: "wrong client type"
    }

    expect(isMSWDevtoolsWebsocketEvent(syn2)).toBe(false)

    const ack = {
      name: "msw-devtools:ack"
    }

    expect(isMSWDevtoolsWebsocketEvent(ack)).toBe(false)

    const mockListUpdate = {
      name: "msw-devtools:mock-list:update"
    }

    expect(isMSWDevtoolsWebsocketEvent(mockListUpdate)).toBe(false)
  })
})
