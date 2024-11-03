import {
  type JsonMock,
  MSWDevtoolsWebsocketEventName,
  serializeMSWDevtoolsWebsocketEvent
} from "core"

import { serverGuard } from "./serverGuard"

export const sendMockListToServer = (mockList: JsonMock[]) =>
  serverGuard((ws) => {
    ws.send(
      serializeMSWDevtoolsWebsocketEvent({
        name: MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
        payload: mockList
      })
    )
  })
