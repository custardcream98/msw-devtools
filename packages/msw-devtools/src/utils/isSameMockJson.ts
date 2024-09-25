import { FIELD_NAME } from "~/constants"
import type { JsonMock } from "~/types"

export const isSameMockJson = (a: JsonMock, b: JsonMock) => {
  return (
    a[FIELD_NAME.URL] === b[FIELD_NAME.URL] &&
    a[FIELD_NAME.METHOD] === b[FIELD_NAME.METHOD]
  )
}
