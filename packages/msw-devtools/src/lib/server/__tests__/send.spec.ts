import {
  MSWDevtoolsWebsocketEventName,
  serializeMSWDevtoolsWebsocketEvent
} from "core"

import { sendMockListToServer } from "~/lib/server/send"
import { serverGuard } from "~/lib/server/serverGuard"

vi.mock("~/lib/server/serverGuard")
vi.mock("core")

const MOCKED_WS = {
  send: vi.fn()
} as any

describe("sendMockListToServer", () => {
  it("should send event to server", () => {
    vi.mocked(serverGuard).mockImplementation((handler) => {
      handler(MOCKED_WS)
    })

    const MOCKED_MOCK_LIST = ["mocked mock list"] as any
    sendMockListToServer(MOCKED_MOCK_LIST)

    expect(MOCKED_WS.send).toHaveBeenCalledTimes(1)
    expect(serializeMSWDevtoolsWebsocketEvent).toHaveBeenCalledTimes(1)
    expect(serializeMSWDevtoolsWebsocketEvent).toHaveBeenCalledWith({
      name: MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
      payload: MOCKED_MOCK_LIST
    })
  })
})
