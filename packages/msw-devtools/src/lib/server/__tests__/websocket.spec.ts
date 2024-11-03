vi.stubGlobal("WebSocket", function (this: { url: string }, url: string) {
  this.url = url
})

let createWebsocketInstance: typeof import("~/lib/server/websocket").createWebsocketInstance
let getWebsocketInstance: typeof import("~/lib/server/websocket").getWebsocketInstance

beforeEach(async () => {
  vi.resetModules()
  ;({ createWebsocketInstance, getWebsocketInstance } = await import(
    "~/lib/server/websocket"
  ))
})

describe("createWebsocketInstance", () => {
  it("should create a new WebSocket instance", () => {
    const instance = createWebsocketInstance()

    expect(instance.url).toMatchInlineSnapshot(
      `"ws://localhost:8080/__msw-devtools"`
    )
  })
})

describe("getWebsocketInstance", () => {
  it("should return the existing WebSocket instance", () => {
    createWebsocketInstance()
    const instance = getWebsocketInstance()

    expect(instance.url).toMatchInlineSnapshot(
      `"ws://localhost:8080/__msw-devtools"`
    )
  })

  it("should throw an error if the WebSocket instance has not been created", () => {
    expect(() => getWebsocketInstance()).toThrowErrorMatchingInlineSnapshot(
      `[Error: WebSocket connection has not been established.]`
    )
  })
})
