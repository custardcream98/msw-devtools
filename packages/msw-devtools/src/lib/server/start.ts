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

export const startServer = (initialMockList?: JsonMock[]) => {
  const ws = createWebsocketInstance()
  ws.addEventListener("open", handleConnectionOpen(ws, initialMockList))
}

const handleConnectionOpen =
  (ws: WebSocket, initialMockList?: JsonMock[]) => () => {
    log.info("WebSocket connection established.")

    sendSyn(ws)
    log.info("SYN sent. Trying to connect to the server.")

    const ackListener = (event: MessageEvent) => {
      eventGuard(
        event.data,
        MSWDevtoolsWebsocketEventName.ACK,
        (serverSideInitialMockList) => {
          ws.removeEventListener("message", ackListener)
          handleAck(ws, serverSideInitialMockList, initialMockList)
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
  initialMockList?: JsonMock[]
) => {
  enableServer()

  if (serverSideInitialMockList) {
    setLocalStorageItem(StorageKey.MOCK_LIST, serverSideInitialMockList)
  }

  ws.send(
    serializeMSWDevtoolsWebsocketEvent({
      name: MSWDevtoolsWebsocketEventName.ACK,
      payload: serverSideInitialMockList ? null : initialMockList || null
    })
  )

  log.info("ACK received. ACK sent.")
}
