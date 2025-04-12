import {
  JsonMockResponseType,
  MethodOption,
  MSWDevtoolsClientType,
  MSWDevtoolsWebsocketEventName,
  StatusOption
} from "./constants"
import type {
  JsonMock,
  JsonMockResponse,
  MSWDevtoolsWebsocketEvent
} from "./types"

const isJsonMockResponse = (data: object): data is JsonMockResponse => {
  return (
    "type" in data &&
    typeof data["type"] === "string" &&
    data["type"] in JsonMockResponseType &&
    "response" in data &&
    (data["type"] === JsonMockResponseType.single
      ? true
      : Array.isArray(data["response"]))
  )
}

export const isJsonMock = (data: unknown): data is JsonMock => {
  return (
    typeof data === "object" &&
    data !== null &&
    "url" in data &&
    typeof data["url"] === "string" &&
    "method" in data &&
    typeof data["method"] === "string" &&
    data["method"] in MethodOption &&
    "status" in data &&
    typeof data["status"] === "string" &&
    data["status"] in StatusOption &&
    "responseDelay" in data &&
    typeof data["responseDelay"] === "number" &&
    "isActivated" in data &&
    typeof data["isActivated"] === "boolean" &&
    "shouldPromptResponse" in data &&
    typeof data["shouldPromptResponse"] === "boolean" &&
    "response" in data &&
    typeof data["response"] === "object" &&
    data["response"] !== null &&
    isJsonMockResponse(data["response"])
  )
}

export const isJsonMocks = (data: unknown[]): data is JsonMock[] => {
  return data.every(isJsonMock)
}

const isMSWDevtoolsClientType = (
  data: unknown
): data is MSWDevtoolsClientType =>
  typeof data === "string" && data in MSWDevtoolsClientType
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

  if ("payload" in event) {
    switch (event.name) {
      case MSWDevtoolsWebsocketEventName.SYN: {
        return isMSWDevtoolsClientType(event.payload)
      }
      case MSWDevtoolsWebsocketEventName.ACK: {
        return (
          event.payload === null ||
          (Array.isArray(event.payload) && isJsonMocks(event.payload))
        )
      }
      case MSWDevtoolsWebsocketEventName.MOCK_LIST_UPDATE: {
        return Array.isArray(event.payload) && isJsonMocks(event.payload)
      }
    }
  }

  return false
}

export const isSameJsonMock = (a: JsonMock, b: JsonMock) => {
  return a.url === b.url && a.method === b.method
}
