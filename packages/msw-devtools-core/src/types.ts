import type { MethodOption, StatusOption } from "./constants"

type Json = Record<string, unknown> | string | number | boolean | null | Json[]

export type JsonMockResponse =
  | {
      type: "single"
      response: Json
    }
  | {
      type: "sequential"
      response: Json[]
    }

export type JsonMock = {
  url: string
  method: MethodOption
  status: StatusOption
  response: JsonMockResponse
  responseDelay: number
  isActivated: boolean
}
