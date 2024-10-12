import {
  eventGuard,
  type JsonMock,
  MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG,
  MSWDevtoolsWebsocketEventName,
  serializeMSWDevtoolsWebsocketEvent
} from "core"

import { StorageKey } from "~/constants"
import { setLocalStorageItem } from "~/hooks/useLocalStorageState"
import { log } from "~/lib/log"

export const serverSendMockList = (mockList: JsonMock[]) => {
  if (isServerEnabled()) {
    ws.send(
      serializeMSWDevtoolsWebsocketEvent({
        name: MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
        payload: mockList
      })
    )
  }
}

export const addMockListUpdateListener = (
  callback: (mockList: JsonMock[]) => void
) => {
  const handleMessage = (event: MessageEvent) => {
    eventGuard(
      event.data,
      MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
      callback
    )
  }

  ws.addEventListener("message", handleMessage)

  return () => {
    ws.removeEventListener("message", handleMessage)
  }
}

export const server = (initialMockList?: JsonMock[]) => {
  if (ws.readyState === WebSocket.OPEN) {
    log.info("WebSocket connection established.")

    ws.send(
      serializeMSWDevtoolsWebsocketEvent({
        name: MSWDevtoolsWebsocketEventName.SYN
      })
    )

    log.info("SYN sent. Trying to connect to the server.")

    const ackListener = (event: MessageEvent) => {
      eventGuard(
        event.data,
        MSWDevtoolsWebsocketEventName.ACK,
        (serverSideInitialMockList) => {
          ws.removeEventListener("message", ackListener)
          _isServerEnabled = true

          if (serverSideInitialMockList) {
            setLocalStorageItem(StorageKey.MOCK_LIST, serverSideInitialMockList)
          }

          ws.send(
            serializeMSWDevtoolsWebsocketEvent({
              name: MSWDevtoolsWebsocketEventName.ACK,
              payload:
                !serverSideInitialMockList && initialMockList
                  ? initialMockList
                  : null
            })
          )

          log.info("ACK received. ACK sent.")
        }
      )
    }

    ws.addEventListener("message", ackListener)
  }
}

let _isServerEnabled = false
const ws = new WebSocket(
  `ws://localhost:${MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG.PORT}${MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG.PATH}`
)

export const isServerEnabled = () => _isServerEnabled
