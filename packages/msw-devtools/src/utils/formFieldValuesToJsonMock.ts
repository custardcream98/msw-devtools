import { FIELD_NAME, type FormFieldValues } from "~/constants"
import type { JsonMock } from "~/types"

export const formFieldValuesToJsonMock = (
  formData: FormFieldValues
): JsonMock => {
  return {
    [FIELD_NAME.URL]: formData[FIELD_NAME.URL],
    [FIELD_NAME.METHOD]: formData[FIELD_NAME.METHOD],
    [FIELD_NAME.STATUS]: formData[FIELD_NAME.STATUS],
    [FIELD_NAME.RESPONSE]: JSON.parse(formData[FIELD_NAME.RESPONSE]),
    isActivated: true,
    [FIELD_NAME.RESPONSE_DELAY]: formData[FIELD_NAME.RESPONSE_DELAY]
  }
}