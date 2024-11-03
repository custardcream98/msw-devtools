import watcher, { type AsyncSubscription } from "@parcel/watcher"
import type { WebSocket } from "ws"

import { readMockListFileRecursive } from "~/cli/utils/file"
import { log } from "~/cli/utils/log"
import { sendMockListToClient } from "~/cli/utils/watch/send"
import { resetFileWatcher, startFileWatcher } from "~/cli/utils/watch/start"

vi.mock("@parcel/watcher")
vi.mock("~/cli/utils/file")
vi.mock("~/cli/utils/log")
vi.mock("~/cli/utils/watch/send")

const MOCKED_WS = {} as WebSocket

beforeEach(() => {
  vi.resetAllMocks()
})

describe("startFileWatcher", () => {
  it("should send updated mock list to client on file change", async () => {
    const MOCKED_DATA = [{ id: "MOCKED_DATA" }] as any
    vi.mocked(readMockListFileRecursive).mockReturnValue(MOCKED_DATA)

    await startFileWatcher(MOCKED_WS)

    const subscribeCallback = vi.mocked(watcher.subscribe).mock.calls[0][1]
    await subscribeCallback(null, {} as any)

    expect(sendMockListToClient).toHaveBeenCalledWith(MOCKED_WS, MOCKED_DATA)
  })

  it("should ignore the initial event on resubscribe", async () => {
    vi.mocked(watcher.subscribe).mockResolvedValue({
      unsubscribe: vi.fn()
    } as AsyncSubscription)

    await startFileWatcher(MOCKED_WS)
    await resetFileWatcher()

    await startFileWatcher(MOCKED_WS)

    const subscribeCallback = vi.mocked(watcher.subscribe).mock.calls[1][1]
    await subscribeCallback(null, {} as any)

    expect(sendMockListToClient).not.toHaveBeenCalled()
  })

  it("should log an error if file watcher fails", async () => {
    await startFileWatcher(MOCKED_WS)

    const subscribeCallback = vi.mocked(watcher.subscribe).mock.calls[0][1]
    const error = new Error("Watcher error")
    await subscribeCallback(error, {} as any)

    expect(log.error).toHaveBeenCalledOnce()
  })
})

describe("resetFileWatcher", () => {
  it("should unsubscribe the file watcher on reset", async () => {
    const MOCKED_UNSUBSCRIBE = vi.fn()
    vi.mocked(watcher.subscribe).mockResolvedValue({
      unsubscribe: MOCKED_UNSUBSCRIBE
    } as AsyncSubscription)

    await startFileWatcher(MOCKED_WS)

    await resetFileWatcher()

    expect(MOCKED_UNSUBSCRIBE).toHaveBeenCalled()
  })
})
