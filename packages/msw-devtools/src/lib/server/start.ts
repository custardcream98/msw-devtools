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

  try {
    await connectWithTimeout(ws, initialMockList)
    log.info("MSW DevTools Server connected.")
  } catch (error) {
    if (error instanceof Error) {
      log.error(`Failed to connect to the server: ${error.message}`)
    } else {
      throw error
    }
  }
}

const connectWithTimeout = (ws: WebSocket, initialMockList?: JsonMock[]) => {
  return Promise.race([
    establishConnection(ws, initialMockList),
    createConnectionTimeout()
  ])
}

const establishConnection = (ws: WebSocket, initialMockList?: JsonMock[]) => {
  return new Promise<void>((resolve, reject) => {
    const handleConnectionError = () => {
      reject(new Error("WebSocket connection error"))
    }

    const handleConnectionOpen = () => {
      setupServerHandshake(ws, initialMockList)
        .then(resolve)
        .finally(() => {
          ws.removeEventListener("error", handleConnectionError)
          ws.removeEventListener("open", handleConnectionOpen)
        })
    }

    ws.addEventListener("open", handleConnectionOpen)
    ws.addEventListener("error", handleConnectionError)
  })
}

const createConnectionTimeout = () => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Connection timed out after ${DEFAULT_TIMEOUT}ms`))
    }, DEFAULT_TIMEOUT)
  })
}

const setupServerHandshake = (ws: WebSocket, initialMockList?: JsonMock[]) => {
  return new Promise<void>((resolve) => {
    sendSyn(ws)

    if (process.env.NODE_ENV === "development") {
      log.info("SYN sent. Trying to connect to the server.")
    }

    const handleAckMessage = (event: MessageEvent) => {
      eventGuard(
        event.data,
        MSWDevtoolsWebsocketEventName.ACK,
        (serverSideInitialMockList) => {
          ws.removeEventListener("message", handleAckMessage)

          enableServer()

          if (serverSideInitialMockList) {
            setLocalStorageItem(StorageKey.MOCK_LIST, serverSideInitialMockList)
          }

          ws.send(
            serializeMSWDevtoolsWebsocketEvent({
              name: MSWDevtoolsWebsocketEventName.ACK,
              payload: serverSideInitialMockList
                ? null
                : initialMockList || null
            })
          )

          resolve()
        }
      )
    }

    ws.addEventListener("message", handleAckMessage)
  })
}

const sendSyn = (ws: WebSocket) => {
  ws.send(
    serializeMSWDevtoolsWebsocketEvent({
      name: MSWDevtoolsWebsocketEventName.SYN,
      payload: MSWDevtoolsClientType.CLIENT
    })
  )
}
