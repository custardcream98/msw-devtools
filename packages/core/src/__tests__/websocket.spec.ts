import { MSWDevtoolsWebsocketEventName } from "../constants"
import type { MSWDevtoolsWebsocketEvent } from "../types"
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
          responseDelay: 1000
        }
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
      serializeMSWDevtoolsWebsocketEvent({ name: "msw-devtools:ack" })
    ).toMatchInlineSnapshot(`"{"name":"msw-devtools:ack"}"`)
  })
})

describe("eventGuard", () => {
  it("should call the callback", () => {
    const syn: MSWDevtoolsWebsocketEvent = {
      name: "msw-devtools:syn"
    }
    const ack: MSWDevtoolsWebsocketEvent = {
      name: "msw-devtools:ack"
    }
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

    const synCallback = vi.fn()
    const ackCallback = vi.fn()
    const mockListUpdateCallback = vi.fn()

    eventGuard(
      JSON.stringify(syn),
      MSWDevtoolsWebsocketEventName.SYN,
      synCallback
    )

    expect(synCallback).toHaveBeenCalledOnce()

    eventGuard(
      JSON.stringify(ack),
      MSWDevtoolsWebsocketEventName.ACK,
      ackCallback
    )

    expect(ackCallback).toHaveBeenCalledOnce()

    eventGuard(
      JSON.stringify(mockListUpdate),
      MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
      mockListUpdateCallback
    )

    expect(mockListUpdateCallback).toHaveBeenCalledWith(mockListUpdate.payload)
  })

  it("should not call the callback if the message is not valid", () => {
    const message = "invalid message"
    const callback = vi.fn()

    eventGuard(message, MSWDevtoolsWebsocketEventName.ACK, callback)

    expect(callback).not.toHaveBeenCalled()
  })

  it("should not call the callback if the event name is not valid", () => {
    const message = {
      name: "msw-devtools:invalid"
    }
    const callback = vi.fn()

    eventGuard(
      JSON.stringify(message),
      MSWDevtoolsWebsocketEventName.ACK,
      callback
    )

    expect(callback).not.toHaveBeenCalled()
  })

  it("should not call the callback if the event payload is not valid", () => {
    const message = {
      name: "msw-devtools:mock-list:update",
      payload: "invalid"
    }
    const callback = vi.fn()

    eventGuard(
      JSON.stringify(message),
      MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
      callback
    )

    expect(callback).not.toHaveBeenCalled()
  })

  it("should not call the callback if the event name is not the target", () => {
    const message = {
      name: "msw-devtools:ack"
    }
    const callback = vi.fn()

    eventGuard(
      JSON.stringify(message),
      MSWDevtoolsWebsocketEventName.SYN,
      callback
    )

    expect(callback).not.toHaveBeenCalled()
  })
})
