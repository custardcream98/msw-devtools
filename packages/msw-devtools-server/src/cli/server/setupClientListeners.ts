import {
  eventGuard,
  JsonMock,
  type MSWDevtoolsClientType,
  MSWDevtoolsWebsocketEventName,
  serializeMSWDevtoolsWebsocketEvent
} from "core"
import type { RawData, WebSocket } from "ws"

import { options } from "~/cli/program"
import {
  readMockListFile,
  readMockListFileRecursive,
  updateMockListFile,
  updateMockListFileRecursive
} from "~/cli/utils/file"
import { log } from "~/cli/utils/log"
import { resetFileWatcher, startFileWatcher } from "~/cli/utils/watch"

import { CONNECTION_TIMEOUT } from "./constants"
import { cleanup, pushCleanup } from "./listener"

const updateMockList = (newMockList: JsonMock[]) => {
  if (options.recursive) {
    updateMockListFileRecursive(newMockList)
  } else {
    updateMockListFile(newMockList)
  }
}

export const setupClientListeners = (
  ws: WebSocket,
  clientType: MSWDevtoolsClientType
) => {
  const initialMockList = options.recursive
    ? readMockListFileRecursive()
    : readMockListFile()

  const handleACK = (data: RawData) => {
    eventGuard(
      data.toString(),
      MSWDevtoolsWebsocketEventName.ACK,
      async (clientSideInitialMockList) => {
        clearTimeout(timeoutId)
        await cleanup(clientType)

        log.info("ACK received. Server connected.")

        if (clientSideInitialMockList && !initialMockList) {
          updateMockList(clientSideInitialMockList)
        }

        await startFileWatcher(ws)
        pushCleanup(clientType, resetFileWatcher)

        const handleMockListUpdate = (data: RawData) => {
          eventGuard(
            data.toString(),
            MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
            async (payload) => {
              await resetFileWatcher()

              updateMockList(payload)

              log.info(
                "Mock list updated on client. Saved the update to the file."
              )

              await startFileWatcher(ws)
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

  const timeoutId = setTimeout(async () => {
    await cleanup(clientType)
    log.error("ACK timeout, connection closed.")
  }, CONNECTION_TIMEOUT)
}
