import watcher, { AsyncSubscription } from "@parcel/watcher"
import {
  type JsonMock,
  MSWDevtoolsWebsocketEventName,
  serializeMSWDevtoolsWebsocketEvent
} from "core"
import type { WebSocket } from "ws"

import { options } from "~/cli/program"
import { readMockListFileRecursive } from "~/cli/utils/file"
import { log } from "~/cli/utils/log"

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
  const subscription = await startWatcher(mockListUpdateHandler(ws))

  _unsubscribe = async () => {
    await subscription.unsubscribe()
    _initialEventOnReSubscribe = true
  }
}

const startWatcher = (onChange: (newMockList: JsonMock[]) => void) =>
  watcher.subscribe(
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
      onChange(newMockList)
    },
    {
      ignore: ["!*.json"]
    }
  )

const sendMockListUpdate = (ws: WebSocket, mockList: JsonMock[]) => {
  ws.send(
    serializeMSWDevtoolsWebsocketEvent({
      name: MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
      payload: mockList
    })
  )
}

const mockListUpdateHandler = (ws: WebSocket) => (mockList: JsonMock[]) => {
  log.info("Mock list updated. Sending the update to the client.")
  sendMockListUpdate(ws, mockList)
}
