import { parseMSWDevtoolsWebsocketEventString } from "../websocket"

describe("parseMSWDevtoolsWebsocketEventString", () => {
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
      parseMSWDevtoolsWebsocketEventString(JSON.stringify(event))
    ).toStrictEqual(event)
  })
})
