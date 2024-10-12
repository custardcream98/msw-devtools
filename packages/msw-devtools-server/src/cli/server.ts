import {
  eventGuard,
  MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG,
  MSWDevtoolsWebsocketEventName,
  serializeMSWDevtoolsWebsocketEvent
} from "core"
import { type RawData, WebSocketServer } from "ws"

import { log } from "~/cli/utils/log"
import { readMockListFile, updateMockListFile, watchMockListFile } from "~/file"

export const startServer = () => {
  const wss = new WebSocketServer({
    path: MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG.PATH,
    port: MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG.PORT
  })

  log.info("Server is running.")

  wss.on("connection", (ws) => {
    log.info(`WebSocket connection established.`)

    const synListener = (data: RawData) => {
      eventGuard(data.toString(), MSWDevtoolsWebsocketEventName.SYN, () => {
        ws.off("message", synListener)
        ws.on("message", ackListener)

        const initialMockList = readMockListFile("mockList.json")

        ws.send(
          serializeMSWDevtoolsWebsocketEvent({
            name: MSWDevtoolsWebsocketEventName.ACK,
            payload: initialMockList
          })
        )

        log.info("SYN received. ACK sent.")
      })
    }

    const ackListener = (data: RawData) => {
      eventGuard(
        data.toString(),
        MSWDevtoolsWebsocketEventName.ACK,
        (clientSideInitialMockList) => {
          ws.off("message", ackListener)

          log.info("ACK received. Server connected.")

          const initialMockList = readMockListFile("mockList.json")

          if (clientSideInitialMockList && !initialMockList) {
            updateMockListFile("mockList.json")(clientSideInitialMockList)
          }

          const openFileWatch = () =>
            watchMockListFile("mockList.json", (mockList) => {
              log.info("Mock list updated. Sending the update to the client.")

              log.info(JSON.stringify(mockList))

              ws.send(
                serializeMSWDevtoolsWebsocketEvent({
                  name: MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
                  payload: mockList
                })
              )
            })
          let closeFileWatch = openFileWatch()

          ws.on("message", (message) => {
            eventGuard(
              message.toString(),
              MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
              (payload) => {
                log.info(
                  "Mock list updated on client. Saving the update to the file."
                )

                closeFileWatch()
                updateMockListFile("mockList.json")(payload)
                closeFileWatch = openFileWatch()
              }
            )
          })
        }
      )
    }

    ws.on("message", synListener)
  })
}
