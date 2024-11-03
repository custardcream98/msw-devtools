import watcher, { AsyncSubscription } from "@parcel/watcher"
import type { WebSocket } from "ws"

import { options } from "~/cli/program"
import { readMockListFileRecursive } from "~/cli/utils/file"
import { log } from "~/cli/utils/log"

import { sendMockListToClient } from "./send"

let _unsubscribe: AsyncSubscription["unsubscribe"]

/**
 * Mock List change event from client triggers file watcher.
 * This behavior is not desired, as it would cause an unnecessary event emission.
 *
 * This flag is used to ignore the initial event.
 *
 * TODO: Remove this flag, find a better way to handle the initial event.
 */
let _initialEventOnReSubscribe = false

export const resetFileWatcher = () => _unsubscribe()

export const startFileWatcher = async (ws: WebSocket) => {
  const subscription = await watcher.subscribe(
    options.output,
    (error, _) => {
      if (error) {
        log.error(`Failed to watch the mock list file: ${error.message}`)
        return
      }

      if (_initialEventOnReSubscribe) {
        _initialEventOnReSubscribe = false
        return
      }

      const newMockList = readMockListFileRecursive(options.output)
      sendMockListToClient(ws, newMockList)
    },
    {
      ignore: ["!*.json"]
    }
  )

  _unsubscribe = async () => {
    await subscription.unsubscribe()
    _initialEventOnReSubscribe = true
  }
}
