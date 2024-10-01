import type { FIELD_NAME, MethodOption, StatusOption } from "~/constants"

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
  [FIELD_NAME.URL]: string
  [FIELD_NAME.METHOD]: MethodOption
  [FIELD_NAME.STATUS]: StatusOption
  [FIELD_NAME.RESPONSE]: JsonMockResponse
  isActivated: boolean
  /**
   * Response delay in seconds.
   */
  [FIELD_NAME.RESPONSE_DELAY]: number
}
