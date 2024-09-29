import { expect } from "vitest"

import { FIELD_NAME } from "~/constants"
import { formFieldValuesToJsonMock } from "~/utils/formFieldValuesToJsonMock"

describe("formFieldValuesToJsonMock", () => {
  it("should return a JsonMock typed object from the form field values", () => {
    const formData = {
      [FIELD_NAME.URL]: "https://api.mswjs.io/user",
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.STATUS]: "200",
      [FIELD_NAME.RESPONSE]: '{"name":"John"}',
      [FIELD_NAME.RESPONSE_DELAY]: 1000
    } as const
    const result = formFieldValuesToJsonMock(formData)
    console.log("result", result)

    expect(result).toEqual({
      [FIELD_NAME.URL]: "https://api.mswjs.io/user",
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.STATUS]: "200",
      [FIELD_NAME.RESPONSE]: { name: "John" },
      isActivated: true,
      [FIELD_NAME.RESPONSE_DELAY]: 1000
    })
  })
})
