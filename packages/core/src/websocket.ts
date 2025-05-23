import type { MSWDevtoolsWebsocketEventName } from "./constants"
import { isMSWDevtoolsWebsocketEvent } from "./guards"
import type {
  MSWDevtoolsWebsocketEvent,
  MSWDevtoolsWebsocketEventMap
} from "./types"

export const deserializeMSWDevtoolsWebsocketEvent = (
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

export const serializeMSWDevtoolsWebsocketEvent = (
  event: MSWDevtoolsWebsocketEvent
) => {
  return JSON.stringify(event)
}

export const eventGuard = async <N extends MSWDevtoolsWebsocketEventName>(
  message: string,
  name: N,
  callback: MSWDevtoolsWebsocketEventMap[N] extends undefined
    ? () => void | Promise<void>
    : (payload: MSWDevtoolsWebsocketEventMap[N]) => void | Promise<void>
) => {
  const event = deserializeMSWDevtoolsWebsocketEvent(message)

  if (!event || event.name !== name) {
    return
  }

  if ("payload" in event) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await callback(event.payload as any)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;((await callback) as any)()
  }
}
