import {
  MSWDevtoolsWebsocketEventName,
  serializeMSWDevtoolsWebsocketEvent
} from "core"

import { sendMockListToClient } from "~/cli/utils/watch/send"

vi.mock("~/cli/utils/log", () => ({
  log: {
    info: vi.fn()
  }
}))
vi.mock("core")

describe("sendMockListToClient", () => {
  it("should send a message to the client", () => {
    vi.mocked(serializeMSWDevtoolsWebsocketEvent).mockImplementation(
      ((message: object) => message) as any
    )

    const MOCKED_WS = {
      send: vi.fn()
    } as any
    const MOCKED_LIST = [{ id: "1" }, { id: "2" }]

    sendMockListToClient(MOCKED_WS, MOCKED_LIST as any)

    expect(MOCKED_WS.send).toHaveBeenCalledTimes(1)
    expect(MOCKED_WS.send).toHaveBeenCalledWith({
      name: MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
      payload: MOCKED_LIST
    })
  })
})
