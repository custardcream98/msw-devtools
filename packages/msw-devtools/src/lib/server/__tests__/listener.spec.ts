import { eventGuard, MSWDevtoolsWebsocketEventName } from "core"

import { addServerMockListUpdateListener } from "~/lib/server/listener"
import { serverGuard } from "~/lib/server/serverGuard"

vi.mock("~/lib/server/serverGuard")
vi.mock("core")

const MOCKED_WS = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
} as any

describe("addServerMockListUpdateListener", () => {
  it("should handle mock list update event", () => {
    vi.mocked(serverGuard).mockImplementation((handler) => {
      handler(MOCKED_WS)
    })
    vi.mocked(eventGuard).mockImplementation(((
      _eventData: any,
      _eventName: any,
      _callback: any
    ) => {}) as any)

    const MOCKED_CALLBACK = vi.fn()
    addServerMockListUpdateListener(MOCKED_CALLBACK)

    expect(MOCKED_WS.addEventListener).toHaveBeenCalledTimes(1)
    expect(MOCKED_WS.removeEventListener).toHaveBeenCalledTimes(0)

    const [event, handler] = MOCKED_WS.addEventListener.mock.calls[0]

    expect(event).toBe("message")

    const MOCKED_EVENT = { data: "mocked event data" }
    handler(MOCKED_EVENT)

    expect(eventGuard).toHaveBeenCalledTimes(1)
    expect(eventGuard).toHaveBeenCalledWith(
      MOCKED_EVENT.data,
      MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
      MOCKED_CALLBACK
    )
  })
})
