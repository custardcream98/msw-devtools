import {
  eventGuard,
  type JsonMock,
  MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG,
  MSWDevtoolsClientType,
  MSWDevtoolsWebsocketEventName,
  serializeMSWDevtoolsWebsocketEvent
} from "core"
import { type RawData, type WebSocket, WebSocketServer } from "ws"

import {
  readMockListFile,
  updateMockListFile,
  watchMockListFile
} from "~/cli/utils/file"
import { log } from "~/cli/utils/log"

let wss: WebSocketServer | null = null

type ListenerCleanup = () => void
const _listenerCleanupsMap: Record<MSWDevtoolsClientType, ListenerCleanup[]> = {
  [MSWDevtoolsClientType.CLIENT]: [],
  [MSWDevtoolsClientType.SERVER_CLIENT]: []
}

const cleanup = (clientType: MSWDevtoolsClientType) => {
  _listenerCleanupsMap[clientType].forEach((fn) => fn())
  _listenerCleanupsMap[clientType] = []
}

const pushCleanup = (
  clientType: MSWDevtoolsClientType,
  cleanup: ListenerCleanup
) => {
  _listenerCleanupsMap[clientType].push(cleanup)
}

export const startServer = () => {
  if (wss) return

  wss = new WebSocketServer({
    path: MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG.PATH,
    port: MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG.PORT
  })

  log.info("Server is running.")
  wss.on("connection", handleConnection)
}

const CONNECTION_TIMEOUT = 10_000

const handleConnection = (ws: WebSocket) => {
  log.info("WebSocket connection established.")

  const handleSYN = (data: RawData) => {
    eventGuard(
      data.toString(),
      MSWDevtoolsWebsocketEventName.SYN,
      (clientType) => {
        cleanup(clientType)

        clearTimeout(timeoutId)
        cleanupSYN()
        setupClientListeners(ws, clientType)

        const closeHandler = () => {
          cleanup(clientType)
          log.info("Client disconnected.")

          ws.off("close", closeHandler)
        }
        ws.on("close", closeHandler)
      }
    )
  }
  const cleanupSYN = () => {
    ws.off("message", handleSYN)
  }

  const timeoutId = setTimeout(() => {
    cleanupSYN()
    log.error("SYN timeout, connection closed.")
  }, CONNECTION_TIMEOUT)

  ws.on("message", handleSYN)
}

const setupClientListeners = (
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

const setupFileWatcher = (ws: WebSocket): ListenerCleanup =>
  watchMockListFile((mockList) => {
    log.info("Mock list updated. Sending the update to the client.")
    sendMockListUpdate(ws, mockList)
  })

const sendMockListUpdate = (ws: WebSocket, mockList: JsonMock[]) => {
  ws.send(
    serializeMSWDevtoolsWebsocketEvent({
      name: MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
      payload: mockList
    })
  )
}
