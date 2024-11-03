vi.mock("~/lib/server/websocket", () => ({
  getWebsocketInstance: () => {}
}))

let enableServer: typeof import("~/lib/server/serverGuard").enableServer
let serverGuard: typeof import("~/lib/server/serverGuard").serverGuard
let isServerEnabled: typeof import("~/lib/server/serverGuard").isServerEnabled

beforeEach(async () => {
  vi.resetModules()
  ;({ enableServer, serverGuard, isServerEnabled } = await import(
    "~/lib/server/serverGuard"
  ))
})

describe("enableServer, isServerEnabled", () => {
  it("enableServer should enable server flag", () => {
    expect(isServerEnabled()).toBe(false)
    enableServer()
    expect(isServerEnabled()).toBe(true)
  })
})

describe("serverGuard", () => {
  it("should return undefined if server is not enabled", () => {
    const result = serverGuard(() => "result")
    expect(result).toBeUndefined()
  })

  it("should return callback result if server is enabled", () => {
    enableServer()
    const result = serverGuard(() => "result")
    expect(result).toBe("result")
  })
})
