import type {
  JsonMockResponseType,
  MethodOption,
  StatusOption
} from "../constants"

export type Json =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | null
  | Json[]

export type JsonMockResponse =
  | {
      type: typeof JsonMockResponseType.single
      response: Json
    }
  | {
      type: typeof JsonMockResponseType.sequential
      response: Json[]
    }

export type JsonMock = {
  url: string
  method: MethodOption
  status: StatusOption
  response: JsonMockResponse
  responseDelay: number
  isActivated: boolean
  shouldPromptResponse: boolean
}
