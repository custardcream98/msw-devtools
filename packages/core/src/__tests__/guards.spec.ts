import { MSWDevtoolsClientType } from "../constants"
import {
  isJsonMock,
  isJsonMocks,
  isMSWDevtoolsWebsocketEvent,
  isSameJsonMock
} from "../guards"
import type { JsonMock, MSWDevtoolsWebsocketEvent } from "../types"

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
      responseDelay: 1000,
      shouldPromptResponse: true
    } as const satisfies JsonMock

    expect(isJsonMock(data)).toBe(true)
  })

  it("should return false if the data is not a JsonMock", () => {
    const data = {}

    expect(isJsonMock(data)).toBe(false)
  })
})

describe("isJsonMocks", () => {
  it("should return false if not all items are JsonMock", () => {
    const mocks = [{ name: "mock1" }, { name: "mock2" }]
    expect(isJsonMocks(mocks)).toBe(false)
  })

  it("should return true if all items are JsonMock", () => {
    const mocks = [
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
      } as const satisfies JsonMock,
      {
        url: "https://test-url2",
        method: "post",
        status: "200",
        response: {
          type: "sequential",
          response: [{ name: "John" }, { name: "Doe" }]
        },
        isActivated: true,
        responseDelay: 1000,
        shouldPromptResponse: true
      } as const satisfies JsonMock
    ]
    expect(isJsonMocks(mocks)).toBe(true)
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
          responseDelay: 1000,
          shouldPromptResponse: true
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
          responseDelay: 1000,
          shouldPromptResponse: true
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
    const ack2: MSWDevtoolsWebsocketEvent = {
      name: "msw-devtools:ack",
      payload: [{ wrong: "mock" } as any]
    }

    expect(isMSWDevtoolsWebsocketEvent(ack2)).toBe(false)

    const mockListUpdate = {
      name: "msw-devtools:mock-list:update"
    }

    expect(isMSWDevtoolsWebsocketEvent(mockListUpdate)).toBe(false)
  })
})

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
      responseDelay: 1000,
      shouldPromptResponse: true
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
      responseDelay: 1000,
      shouldPromptResponse: true
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
      responseDelay: 1000,
      shouldPromptResponse: true
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
      responseDelay: 1000,
      shouldPromptResponse: true
    }

    const result = isSameJsonMock(a, b)

    expect(result).toBe(false)
  })
})
