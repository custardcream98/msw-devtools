import { MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG } from "core"
import { WebSocketServer } from "ws"

import { handleConnection } from "~/cli/server/handleConnection"
import { startServer } from "~/cli/server/startServer"

vi.mock("ws")
vi.mock("~/cli/utils/log")
vi.mock("~/cli/server/handleConnection")

describe("startServer", () => {
  it("should initialize a WebSocketServer with the correct path and port", () => {
    const mockedWssOn = vi.fn()
    const MockedWebSocketServer = vi.fn(function (
      this: { path: string; port: number; on: () => void },
      config: {
        path: string
        port: number
      }
    ) {
      this.path = config.path
      this.port = config.port
      this.on = mockedWssOn
    })
    vi.mocked(WebSocketServer).mockImplementation(MockedWebSocketServer as any)

    startServer()

    expect(MockedWebSocketServer).toHaveBeenCalledOnce()
    expect(MockedWebSocketServer).toHaveBeenCalledWith({
      path: MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG.PATH,
      port: MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG.PORT
    })
    expect(mockedWssOn).toHaveBeenCalledOnce()
    expect(mockedWssOn).toHaveBeenCalledWith("connection", handleConnection)
  })
})
