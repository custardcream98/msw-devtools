import { isMSWDevtoolsWebsocketEvent } from "./guards"
import type { MSWDevtoolsWebsocketEvent } from "./types"

export const parseMSWDevtoolsWebsocketEventString = (
  eventString: string
): MSWDevtoolsWebsocketEvent | null => {
  try {
    const parsedEvent = JSON.parse(eventString)

    if (isMSWDevtoolsWebsocketEvent(parsedEvent)) {
      return parsedEvent
    }

    return null
  } catch (error) {
    return null
  }
}
