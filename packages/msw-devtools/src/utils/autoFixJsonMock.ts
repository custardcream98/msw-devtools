import {
  type JsonMock,
  type JsonMockResponse,
  JsonMockResponseType,
  type MethodOption,
  type StatusOption
} from "core"

type JsonMockFixable = Omit<
  JsonMock,
  "status" | "responseDelay" | "method" | "response"
> & {
  status: number | StatusOption
  responseDelay: string | number
  method: string | MethodOption
  response: JsonMockResponse | unknown
}

const isAutoFixable = (target: unknown): target is JsonMockFixable => {
  return (
    typeof target === "object" &&
    target !== null &&
    "status" in target &&
    "responseDelay" in target &&
    "method" in target
  )
}

/**
 * try to auto fix json mock
 *
 * * fixes status in number
 * * fixes responseDelay in string
 * * fixes method in lowercase
 * * fixes if response is not JsonMockResponse type
 * * fixes if shouldPromptResponse is not boolean
 */
export const autoFixJsonMock = (target: unknown) => {
  if (!isAutoFixable(target)) {
    return
  }

  if (typeof target.status === "number") {
    target.status = String(target.status) as StatusOption
  }

  if (typeof target.responseDelay === "string") {
    target.responseDelay = Number(target.responseDelay)
  }

  if (typeof target.method === "string") {
    target.method = target.method.toLowerCase()
  }

  if (
    typeof target.response !== "object" ||
    target.response === null ||
    !("type" in target.response) ||
    !(
      typeof target.response.type === "string" &&
      target.response.type in JsonMockResponseType
    )
  ) {
    target.response = {
      type: "single",
      response: target.response
    }
  }

  if (typeof target.shouldPromptResponse !== "boolean") {
    target.shouldPromptResponse = false
  }

  return target as JsonMock
}
