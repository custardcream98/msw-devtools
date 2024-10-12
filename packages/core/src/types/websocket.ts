import type { MSWDevtoolsWebsocketEventName } from "../constants"
import type { JsonMock } from "./JsonMock"

export type MSWDevtoolsWebsocketEventMap = {
  [MSWDevtoolsWebsocketEventName.SYN]: undefined
  [MSWDevtoolsWebsocketEventName.ACK]: JsonMock[] | null
  [MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE]: JsonMock[]
}

export type MSWDevtoolsWebsocketEvent = {
  [K in keyof MSWDevtoolsWebsocketEventMap]: MSWDevtoolsWebsocketEventMap[K] extends undefined
    ? {
        name: K
      }
    : {
        name: K
        payload: MSWDevtoolsWebsocketEventMap[K]
      }
}[keyof MSWDevtoolsWebsocketEventMap]
