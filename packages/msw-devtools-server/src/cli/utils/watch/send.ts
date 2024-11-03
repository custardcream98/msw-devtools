import {
  type JsonMock,
  MSWDevtoolsWebsocketEventName,
  serializeMSWDevtoolsWebsocketEvent
} from "core"
import type { WebSocket } from "ws"

import { log } from "~/cli/utils/log"

export const sendMockListToClient = (ws: WebSocket, mockList: JsonMock[]) => {
  log.info("Mock list updated. Sending the update to the client.")
  ws.send(
    serializeMSWDevtoolsWebsocketEvent({
      name: MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
      payload: mockList
    })
  )
}
