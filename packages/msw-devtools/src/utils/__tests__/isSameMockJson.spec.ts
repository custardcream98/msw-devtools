import { FIELD_NAME } from "~/constants"
import type { JsonMock } from "~/types"
import { isSameJsonMock } from "~/utils/isSameJsonMock"

describe("isSameJsonMock", () => {
  it("should return true if the two JsonMock objects are the same", () => {
    const a: JsonMock = {
      [FIELD_NAME.URL]: "https://api.mswjs.io/user",
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.STATUS]: "200",
      [FIELD_NAME.RESPONSE]: { name: "John" },
      isActivated: true,
      [FIELD_NAME.RESPONSE_DELAY]: 1000
    }
    const b: JsonMock = {
      [FIELD_NAME.URL]: "https://api.mswjs.io/user",
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.STATUS]: "200",
      [FIELD_NAME.RESPONSE]: { name: "John" },
      isActivated: true,
      [FIELD_NAME.RESPONSE_DELAY]: 1000
    }

    const result = isSameJsonMock(a, b)

    expect(result).toBe(true)
  })

  it("should return false if the two JsonMock objects are different", () => {
    const a: JsonMock = {
      [FIELD_NAME.URL]: "https://api.mswjs.io/user",
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.STATUS]: "200",
      [FIELD_NAME.RESPONSE]: { name: "John" },
      isActivated: true,
      [FIELD_NAME.RESPONSE_DELAY]: 1000
    }
    const b: JsonMock = {
      [FIELD_NAME.URL]: "https://api.mswjs.io/user",
      [FIELD_NAME.METHOD]: "put",
      [FIELD_NAME.STATUS]: "200",
      [FIELD_NAME.RESPONSE]: { name: "John" },
      isActivated: true,
      [FIELD_NAME.RESPONSE_DELAY]: 1000
    }

    const result = isSameJsonMock(a, b)

    expect(result).toBe(false)
  })
})
