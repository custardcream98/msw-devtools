import {
  eventGuard,
  type JsonMock,
  MSWDevtoolsClientType,
  MSWDevtoolsWebsocketEventName,
  serializeMSWDevtoolsWebsocketEvent
} from "core"

import { StorageKey } from "~/constants"
import { setLocalStorageItem } from "~/hooks/useLocalStorageState"
import { log } from "~/lib/log"

import { enableServer } from "./serverGuard"
import { createWebsocketInstance } from "./websocket"

const DEFAULT_TIMEOUT = 5_000

export const startServer = async (initialMockList?: JsonMock[]) => {
  const ws = createWebsocketInstance()

  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const createServerConnectionPromise = () =>
    new Promise<void>((resolve, reject) => {
      const handleConnectionError = () =>
        reject(new Error("Failed to connect to the server"))

      const _handleConnectionOpen = () => {
        handleConnectionOpen(ws, initialMockList, () => {
          ws.removeEventListener("error", handleConnectionError)
          ws.removeEventListener("open", _handleConnectionOpen)

          if (timeoutId) {
            clearTimeout(timeoutId)
          }

          resolve()
        })
      }
      ws.addEventListener("open", _handleConnectionOpen)
      ws.addEventListener("error", handleConnectionError)
    })

  return Promise.race([
    createServerConnectionPromise(),
    new Promise<void>((resolve) => {
      timeoutId = setTimeout(() => {
        log.error("Failed to connect to the server")
        resolve()
      }, DEFAULT_TIMEOUT)
    })
  ])
}

const handleConnectionOpen = (
  ws: WebSocket,
  initialMockList?: JsonMock[],
  onConnectionEstablished?: () => void
) => {
  sendSyn(ws)

  if (process.env.NODE_ENV === "development") {
    log.info("SYN sent. Trying to connect to the server.")
  }

  const ackListener = (event: MessageEvent) => {
    eventGuard(
      event.data,
      MSWDevtoolsWebsocketEventName.ACK,
      (serverSideInitialMockList) => {
        ws.removeEventListener("message", ackListener)
        handleAck(
          ws,
          serverSideInitialMockList,
          initialMockList,
          onConnectionEstablished
        )
      }
    )
  }

  ws.addEventListener("message", ackListener)
}

const sendSyn = (ws: WebSocket) => {
  ws.send(
    serializeMSWDevtoolsWebsocketEvent({
      name: MSWDevtoolsWebsocketEventName.SYN,
      payload: MSWDevtoolsClientType.CLIENT
    })
  )
}

const handleAck = (
  ws: WebSocket,
  serverSideInitialMockList: JsonMock[] | null,
  initialMockList?: JsonMock[],
  onConnectionEstablished?: () => void
) => {
  enableServer()
  onConnectionEstablished?.()

  if (serverSideInitialMockList) {
    setLocalStorageItem(StorageKey.MOCK_LIST, serverSideInitialMockList)
  }

  ws.send(
    serializeMSWDevtoolsWebsocketEvent({
      name: MSWDevtoolsWebsocketEventName.ACK,
      payload: serverSideInitialMockList ? null : initialMockList || null
    })
  )

  log.info("MSW DevTools Server connected.")
}
