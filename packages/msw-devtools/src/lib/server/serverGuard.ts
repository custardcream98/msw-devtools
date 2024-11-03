import { getWebsocketInstance } from "./websocket"

let _isServerEnabled = false

export const enableServer = () => {
  _isServerEnabled = true
}
export const isServerEnabled = () => _isServerEnabled

export const serverGuard = <T>(
  callback: (ws: WebSocket) => T
): T | undefined => {
  if (!isServerEnabled()) {
    return
  }

  return callback(getWebsocketInstance())
}
