import {
  eventGuard,
  MSWDevtoolsClientType,
  MSWDevtoolsWebsocketEventName,
  serializeMSWDevtoolsWebsocketEvent
} from "core"

import { CONNECTION_TIMEOUT } from "~/cli/server/constants"
import { cleanup } from "~/cli/server/listener"
import { setupClientListeners } from "~/cli/server/setupClientListeners"
import { readMockListFile, updateMockListFile } from "~/cli/utils/file"
import { log } from "~/cli/utils/log"

vi.mock("core")

vi.mock("~/cli/utils/log", () => ({
  log: {
    info: vi.fn(),
    error: vi.fn()
  }
}))
vi.mock("~/cli/utils/file")
vi.mock("~/cli/server/listener")

beforeEach(() => {
  vi.clearAllMocks()
})

describe("setupClientListeners", () => {
  it("should register ack handler and send ack to client", () => {
    const ws = {
      on: vi.fn(),
      off: vi.fn(),
      send: vi.fn()
    }
    const MOCKED_MOCK_LIST = ["mock1", "mock2"]

    vi.mocked(serializeMSWDevtoolsWebsocketEvent).mockImplementation(
      vi.fn((target) => target)
    )
    vi.mocked(readMockListFile).mockReturnValue(MOCKED_MOCK_LIST as any)

    setupClientListeners(ws as any, MSWDevtoolsClientType.CLIENT)

    expect(ws.on).toHaveBeenCalledOnce()
    expect(ws.on).toHaveBeenCalledWith("message", expect.any(Function))

    expect(ws.send).toHaveBeenCalledOnce()
    expect(ws.send).toHaveBeenCalledWith({
      name: MSWDevtoolsWebsocketEventName.ACK,
      payload: MOCKED_MOCK_LIST
    })
  })

  it("should timeout if no ack received before CONNECTION_TIMEOUT", async () => {
    vi.useFakeTimers({
      shouldAdvanceTime: true
    })

    const ws = {
      on: vi.fn(),
      off: vi.fn(),
      send: vi.fn()
    }
    const MOCKED_MOCK_LIST = ["mock1", "mock2"]

    vi.mocked(readMockListFile).mockReturnValue(MOCKED_MOCK_LIST as any)

    setupClientListeners(ws as any, MSWDevtoolsClientType.CLIENT)
    await vi.advanceTimersByTimeAsync(CONNECTION_TIMEOUT)

    expect(cleanup).toHaveBeenCalledOnce()
    expect(log.error).toHaveBeenCalledOnce()

    vi.useRealTimers()
  })

  it("should update mock list file if no file on server, and client has sent initial mock list", async () => {
    const ws = {
      on: vi.fn(),
      off: vi.fn(),
      send: vi.fn()
    }
    const MOCKED_MOCK_LIST_FROM_CLIENT = ["mock1", "mock2"]

    vi.mocked(readMockListFile).mockReturnValue(null)
    vi.mocked(eventGuard).mockImplementation(
      vi.fn((_, __, callback) => callback(MOCKED_MOCK_LIST_FROM_CLIENT as any))
    )

    setupClientListeners(ws as any, MSWDevtoolsClientType.CLIENT)
    const handleACK = ws.on.mock.calls[0][1]
    await handleACK({
      toString: () => null
    })

    expect(updateMockListFile).toHaveBeenCalledOnce()
    expect(updateMockListFile).toHaveBeenCalledWith(
      MOCKED_MOCK_LIST_FROM_CLIENT
    )
  })

  it("should not update mock list file if there's file on server, and client has sent initial mock list", async () => {
    const ws = {
      on: vi.fn(),
      off: vi.fn(),
      send: vi.fn()
    }
    const MOCKED_MOCK_LIST = ["mock1", "mock2"]
    const MOCKED_MOCK_LIST_FROM_CLIENT = ["mock3", "mock4"]

    vi.mocked(readMockListFile).mockReturnValue(MOCKED_MOCK_LIST as any)
    vi.mocked(eventGuard).mockImplementation(
      vi.fn((_, __, callback) => callback(MOCKED_MOCK_LIST_FROM_CLIENT as any))
    )

    setupClientListeners(ws as any, MSWDevtoolsClientType.CLIENT)
    const handleACK = ws.on.mock.calls[0][1]
    await handleACK({
      toString: () => null
    })

    expect(updateMockListFile).not.toHaveBeenCalled()
  })

  // TODO: test the rest of the function
})
