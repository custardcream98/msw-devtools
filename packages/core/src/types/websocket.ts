import type { MSWDevtoolsWebsocketEventName } from "../constants"
import type { JsonMock } from "./JsonMock"

export type MSWDevtoolsWebsocketEvent =
  | {
      name: typeof MSWDevtoolsWebsocketEventName.SYN
    }
  | {
      name: typeof MSWDevtoolsWebsocketEventName.ACK
    }
  | {
      name: typeof MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE
      payload: JsonMock[]
    }
