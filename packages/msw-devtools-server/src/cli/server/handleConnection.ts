import { eventGuard, MSWDevtoolsWebsocketEventName } from "core"
import type { RawData, WebSocket } from "ws"

import { log } from "~/cli/utils/log"

import { CONNECTION_TIMEOUT } from "./constants"
import { cleanup } from "./listener"
import { setupClientListeners } from "./setupClientListeners"

export const handleConnection = (ws: WebSocket) => {
  log.info("WebSocket connection established.")

  const handleSYN = (data: RawData) =>
    eventGuard(
      data.toString(),
      MSWDevtoolsWebsocketEventName.SYN,
      async (clientType) => {
        await cleanup(clientType)

        clearTimeout(timeoutId)
        cleanupSYN()
        setupClientListeners(ws, clientType)

        const closeHandler = async () => {
          await cleanup(clientType)
          log.info("Client disconnected.")

          ws.off("close", closeHandler)
        }
        ws.on("close", closeHandler)
      }
    )

  const cleanupSYN = () => {
    ws.off("message", handleSYN)
  }

  const timeoutId = setTimeout(() => {
    cleanupSYN()
    log.error("SYN timeout, connection closed.")
  }, CONNECTION_TIMEOUT)

  ws.on("message", handleSYN)
}
