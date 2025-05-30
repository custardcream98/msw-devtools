import {
  MSWDevtoolsClientType,
  MSWDevtoolsWebsocketEventName
} from "../constants"
import type { JsonMock, MSWDevtoolsWebsocketEvent } from "../types"
import {
  deserializeMSWDevtoolsWebsocketEvent,
  eventGuard,
  serializeMSWDevtoolsWebsocketEvent
} from "../websocket"

describe("deserializeMSWDevtoolsWebsocketEvent", () => {
  it("should parse the event data", () => {
    const event = {
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
        } satisfies JsonMock
      ]
    }

    expect(
      deserializeMSWDevtoolsWebsocketEvent(JSON.stringify(event))
    ).toStrictEqual(event)
  })
})

describe("serializeMSWDevtoolsWebsocketEvent", () => {
  it("should stringify the event data", () => {
    expect(
      serializeMSWDevtoolsWebsocketEvent({
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
          } satisfies JsonMock
        ]
      })
    ).toMatchInlineSnapshot(
      `"{"name":"msw-devtools:ack","payload":[{"url":"https://test-url","method":"get","status":"200","response":{"type":"single","response":{"name":"John"}},"isActivated":true,"responseDelay":1000,"shouldPromptResponse":true}]}"`
    )
  })
})

describe("eventGuard", () => {
  it("should call the callback - syn", async () => {
    const syn: MSWDevtoolsWebsocketEvent = {
      name: "msw-devtools:syn",
      payload: MSWDevtoolsClientType.CLIENT
    }

    const callback = vi.fn()

    await eventGuard(
      JSON.stringify(syn),
      MSWDevtoolsWebsocketEventName.SYN,
      callback
    )

    expect(callback).toHaveBeenCalledOnce()
  })

  it("should call the callback - ack", async () => {
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
        } satisfies JsonMock
      ]
    }

    const callback = vi.fn()

    await eventGuard(
      JSON.stringify(ack),
      MSWDevtoolsWebsocketEventName.ACK,
      callback
    )

    expect(callback).toHaveBeenCalledWith(ack.payload)
    expect(callback).toHaveBeenCalledOnce()
  })

  it("should call the callback - syn", async () => {
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
        } satisfies JsonMock
      ]
    }

    const callback = vi.fn()

    await eventGuard(
      JSON.stringify(mockListUpdate),
      MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
      callback
    )

    expect(callback).toHaveBeenCalledWith(mockListUpdate.payload)
  })

  it("should not call the callback if the message is not valid", async () => {
    const message = "invalid message"
    const callback = vi.fn()

    await eventGuard(message, MSWDevtoolsWebsocketEventName.ACK, callback)

    expect(callback).not.toHaveBeenCalled()
  })

  it("should not call the callback if the event name is not valid", async () => {
    const message = {
      name: "msw-devtools:invalid"
    }
    const callback = vi.fn()

    await eventGuard(
      JSON.stringify(message),
      MSWDevtoolsWebsocketEventName.ACK,
      callback
    )

    expect(callback).not.toHaveBeenCalled()
  })

  it("should not call the callback if the event payload is not valid", async () => {
    const message = {
      name: "msw-devtools:mock-list:update",
      payload: "invalid"
    }
    const callback = vi.fn()

    await eventGuard(
      JSON.stringify(message),
      MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
      callback
    )

    expect(callback).not.toHaveBeenCalled()
  })

  it("should not call the callback if the event name is not the target", async () => {
    const message = {
      name: "msw-devtools:ack"
    }
    const callback = vi.fn()

    await eventGuard(
      JSON.stringify(message),
      MSWDevtoolsWebsocketEventName.SYN,
      callback
    )

    expect(callback).not.toHaveBeenCalled()
  })
})
