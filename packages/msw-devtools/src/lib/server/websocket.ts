import { MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG } from "core"

let _ws: WebSocket

const WEB_SOCKET_URL = `ws://localhost:${MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG.PORT}${MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG.PATH}`

export const createWebsocketInstance = () => {
  _ws = new WebSocket(WEB_SOCKET_URL)

  return _ws
}

export const getWebsocketInstance = () => {
  if (!_ws) {
    throw new Error("WebSocket connection has not been established.")
  }

  return _ws
}
