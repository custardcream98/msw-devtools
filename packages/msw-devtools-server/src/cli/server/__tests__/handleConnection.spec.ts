import {
  eventGuard,
  MSWDevtoolsClientType,
  MSWDevtoolsWebsocketEventName
} from "core"

import { CONNECTION_TIMEOUT } from "~/cli/server/constants"
import { handleConnection } from "~/cli/server/handleConnection"
import { cleanup } from "~/cli/server/listener"
import { setupClientListeners } from "~/cli/server/setupClientListeners"

vi.mock("~/cli/utils/log", () => ({
  log: {
    info: vi.fn(),
    error: vi.fn()
  }
}))
vi.mock("~/cli/server/listener")
vi.mock("~/cli/server/setupClientListeners")
vi.mock("core")

describe("handleConnection", () => {
  it("should connect with client before CONNECTION_TIMEOUT", () => {
    const mockedEventGuard = vi.fn((_, __, callback) => {
      callback(MSWDevtoolsClientType.CLIENT)
    })
    vi.mocked(eventGuard).mockImplementation(mockedEventGuard)
    const ws = {
      on: vi.fn(),
      off: vi.fn()
    }

    handleConnection(ws as any)

    expect(ws.on).toHaveBeenCalledOnce()

    const handleSYN = ws.on.mock.calls[0][1]

    handleSYN({
      toString: () =>
        JSON.stringify({
          type: MSWDevtoolsWebsocketEventName.SYN,
          payload: MSWDevtoolsClientType.CLIENT
        })
    })

    expect(cleanup).toHaveBeenCalledOnce()
    expect(setupClientListeners).toHaveBeenCalledOnce()
    expect(setupClientListeners).toHaveBeenCalledWith(
      ws,
      MSWDevtoolsClientType.CLIENT
    )
  })

  it("should cleanup handlers on close event", () => {
    const mockedEventGuard = vi.fn((_, __, callback) => {
      callback(MSWDevtoolsClientType.CLIENT)
    })
    vi.mocked(eventGuard).mockImplementation(mockedEventGuard)
    let closeHandler: any
    const ws = {
      on: vi.fn((type, handler) =>
        type === "close" ? (closeHandler = handler) : null
      ),
      off: vi.fn()
    }

    handleConnection(ws as any)

    expect(ws.on).toHaveBeenCalledOnce()

    const handleSYN = ws.on.mock.calls[0][1]

    handleSYN({
      toString: () =>
        JSON.stringify({
          type: MSWDevtoolsWebsocketEventName.SYN,
          payload: MSWDevtoolsClientType.CLIENT
        })
    })
    closeHandler()

    expect(cleanup).toHaveBeenCalledTimes(3)
  })

  it("should timeout after CONNECTION_TIMEOUT", async () => {
    vi.useFakeTimers({
      shouldAdvanceTime: true
    })

    const mockedEventGuard = vi.fn((_, __, callback) => {
      callback(MSWDevtoolsClientType.CLIENT)
    })
    vi.mocked(eventGuard).mockImplementation(mockedEventGuard)
    const ws = {
      on: vi.fn(),
      off: vi.fn()
    }

    handleConnection(ws as any)

    expect(ws.off).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(CONNECTION_TIMEOUT)

    expect(ws.off).toHaveBeenCalledOnce()

    vi.useRealTimers()
  })
})
