import { MSWDevtoolsWebsocketEventName } from "./constants"
import { JsonMock, MSWDevtoolsWebsocketEvent } from "./types"

export const isJsonMock = (data: unknown): data is JsonMock => {
  return (
    typeof data === "object" &&
    data !== null &&
    "url" in data &&
    "method" in data &&
    "status" in data &&
    "response" in data &&
    "responseDelay" in data &&
    typeof data["url"] === "string" &&
    typeof data["method"] === "string" &&
    typeof data["status"] === "string" &&
    typeof data["response"] === "object" &&
    data["response"] !== null &&
    "type" in data["response"] &&
    (data["response"]["type"] === "single" ||
      data["response"]["type"] === "sequential") &&
    "responseDelay" in data &&
    typeof data["responseDelay"] === "number" &&
    "isActivated" in data &&
    typeof data["isActivated"] === "boolean"
  )
}

export const isMSWDevtoolsWebsocketEvent = (
  event: unknown
): event is MSWDevtoolsWebsocketEvent => {
  if (
    typeof event !== "object" ||
    event === null ||
    !("name" in event) ||
    typeof event.name !== "string"
  ) {
    return false
  }

  if (
    event.name === MSWDevtoolsWebsocketEventName.SYN ||
    ((event.name === MSWDevtoolsWebsocketEventName.ACK ||
      event.name === MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE) &&
      "payload" in event &&
      Array.isArray(event.payload) &&
      event.payload.every(isJsonMock))
  ) {
    return true
  }

  return false
}
