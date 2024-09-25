import type { FIELD_NAME, MethodOption, StatusOption } from "~/constants"

export type JsonMock = {
  [FIELD_NAME.URL]: string
  [FIELD_NAME.METHOD]: MethodOption
  [FIELD_NAME.STATUS]: StatusOption
  [FIELD_NAME.RESPONSE]: object
  isActivated: boolean
  [FIELD_NAME.RESPONSE_DELAY]: number
}
