import {
  type JsonMock,
  MSWDevtoolsWebsocketEventName,
  serializeMSWDevtoolsWebsocketEvent
} from "core"
import type { WebSocket } from "ws"

import { watchMockListFile } from "~/cli/utils/file"
import { log } from "~/cli/utils/log"

import type { ListenerCleanup } from "./listener"

const sendMockListUpdate = (ws: WebSocket, mockList: JsonMock[]) => {
  ws.send(
    serializeMSWDevtoolsWebsocketEvent({
      name: MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
      payload: mockList
    })
  )
}

export const setupFileWatcher = (ws: WebSocket): ListenerCleanup =>
  watchMockListFile((mockList) => {
    log.info("Mock list updated. Sending the update to the client.")
    sendMockListUpdate(ws, mockList)
  })
