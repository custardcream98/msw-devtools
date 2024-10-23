import {
  eventGuard,
  type MSWDevtoolsClientType,
  MSWDevtoolsWebsocketEventName,
  serializeMSWDevtoolsWebsocketEvent
} from "core"
import type { RawData, WebSocket } from "ws"

import { readMockListFile, updateMockListFile } from "~/cli/utils/file"
import { log } from "~/cli/utils/log"

import { CONNECTION_TIMEOUT } from "./constants"
import { setupFileWatcher } from "./file"
import { cleanup, pushCleanup } from "./listener"

export const setupClientListeners = (
  ws: WebSocket,
  clientType: MSWDevtoolsClientType
) => {
  const initialMockList = readMockListFile()

  const handleACK = (data: RawData) => {
    eventGuard(
      data.toString(),
      MSWDevtoolsWebsocketEventName.ACK,
      (clientSideInitialMockList) => {
        clearTimeout(timeoutId)
        cleanup(clientType)
        log.info("ACK received. Server connected.")
        if (clientSideInitialMockList && !initialMockList) {
          updateMockListFile(clientSideInitialMockList)
        }

        let closeFileWatch = setupFileWatcher(ws)
        pushCleanup(
          clientType,
          // should keep reference
          // by assigning a inline cleanup
          () => closeFileWatch()
        )

        const handleMockListUpdate = (data: RawData) => {
          eventGuard(
            data.toString(),
            MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
            (payload) => {
              log.info(
                "Mock list updated on client. Saving the update to the file."
              )

              closeFileWatch()
              updateMockListFile(payload)
              closeFileWatch = setupFileWatcher(ws)
              // doesn't need to push to cleanup because it's already pushed
            }
          )
        }

        ws.on("message", handleMockListUpdate)
        pushCleanup(clientType, () => ws.off("message", handleMockListUpdate))
      }
    )
  }

  ws.on("message", handleACK)
  pushCleanup(clientType, () => ws.off("message", handleACK))

  ws.send(
    serializeMSWDevtoolsWebsocketEvent({
      name: MSWDevtoolsWebsocketEventName.ACK,
      payload: initialMockList
    })
  )
  log.info("SYN received. ACK sent.")

  const timeoutId = setTimeout(() => {
    cleanup(clientType)
    log.error("ACK timeout, connection closed.")
  }, CONNECTION_TIMEOUT)
}
