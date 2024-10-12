import {
  eventGuard,
  generateHandler,
  type JsonMock,
  MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG,
  MSWDevtoolsWebsocketEventName,
  serializeMSWDevtoolsWebsocketEvent
} from "core"
import type { HttpHandler } from "msw"
import type { SetupServerApi } from "msw/node"
import { type RawData, WebSocket } from "ws"

import { readMockListFile } from "~/file"

const ws = new WebSocket(
  `ws://localhost:${MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG.PORT}${MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG.PATH}`
)

export const register = ({ server }: { server: SetupServerApi }) => {
  ws.on("open", () => {
    const use = (jsonMocks: JsonMock[]) => {
      server.resetHandlers(...jsonMocks.map(generateHandler))
    }

    ws.send(
      serializeMSWDevtoolsWebsocketEvent({
        name: MSWDevtoolsWebsocketEventName.SYN
      })
    )

    const ackListener = (data: RawData) => {
      eventGuard(
        data.toString(),
        MSWDevtoolsWebsocketEventName.ACK,
        (initialMockList) => {
          ws.off("message", ackListener)
          if (initialMockList) {
            use(initialMockList)
          }

          ws.send(
            serializeMSWDevtoolsWebsocketEvent({
              name: MSWDevtoolsWebsocketEventName.ACK,
              payload: null
            })
          )

          const mockListUpdateListener = (data: RawData) => {
            eventGuard(
              data.toString(),
              MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
              (jsonMocks) => {
                use(jsonMocks)
              }
            )
          }

          ws.on("message", mockListUpdateListener)
        }
      )
    }

    ws.on("message", ackListener)
  })
}

export const getInitialHandlers = (): HttpHandler[] => {
  const jsonMockList = readMockListFile("mockList.json")

  if (jsonMockList) {
    return jsonMockList.map(generateHandler)
  }

  return []
}
