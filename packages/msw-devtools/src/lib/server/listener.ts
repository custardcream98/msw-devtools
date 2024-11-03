import { eventGuard, type JsonMock, MSWDevtoolsWebsocketEventName } from "core"

import { serverGuard } from "~/lib/server/serverGuard"

export const addServerMockListUpdateListener = (
  callback: (mockList: JsonMock[]) => void
) =>
  serverGuard((ws) => {
    const handleMessage = (event: MessageEvent) => {
      eventGuard(
        event.data,
        MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE,
        callback
      )
    }

    ws.addEventListener("message", handleMessage)

    return () => {
      ws.removeEventListener("message", handleMessage)
    }
  })
