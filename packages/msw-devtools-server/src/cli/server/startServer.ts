import { MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG } from "core"
import { WebSocketServer } from "ws"

import { log } from "~/cli/utils/log"

import { handleConnection } from "./handleConnection"

let wss: WebSocketServer | null = null

export const startServer = () => {
  if (wss) return

  wss = new WebSocketServer({
    path: MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG.PATH,
    port: MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG.PORT
  })

  log.info("Server is running.")
  wss.on("connection", handleConnection)
}
