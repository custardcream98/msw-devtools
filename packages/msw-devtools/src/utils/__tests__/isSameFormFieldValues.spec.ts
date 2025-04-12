import { FIELD_NAME, type FormFieldValues } from "~/constants"
import { isSameFormFieldValues } from "~/utils/isSameFormFieldValues"

describe("isSameFormFieldValues", () => {
  it("should return true if the given form field values are the same", () => {
    const a = {
      [FIELD_NAME.URL]: "https://example-url",
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.STATUS]: "200",
      [FIELD_NAME.RESPONSE_DELAY]: 0,
      [FIELD_NAME.RESPONSE]: {
        type: "single",
        response: JSON.stringify({ message: "Hello, world!" })
      },
      [FIELD_NAME.IS_ACTIVATED]: true,
      [FIELD_NAME.SHOULD_PROMPT_RESPONSE]: true
    } as const satisfies FormFieldValues
    const b = {
      [FIELD_NAME.URL]: "https://example-url",
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.STATUS]: "200",
      [FIELD_NAME.RESPONSE_DELAY]: 0,
      [FIELD_NAME.RESPONSE]: {
        type: "single",
        response: JSON.stringify({ message: "Hello, world!" })
      },
      [FIELD_NAME.IS_ACTIVATED]: true,
      [FIELD_NAME.SHOULD_PROMPT_RESPONSE]: true
    } as const satisfies FormFieldValues

    expect(isSameFormFieldValues(a, b)).toBe(true)
  })

  it("should return false if the given form field values are different", () => {
    const a = {
      [FIELD_NAME.URL]: "https://example-url",
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.STATUS]: "200",
      [FIELD_NAME.RESPONSE_DELAY]: 0,
      [FIELD_NAME.RESPONSE]: {
        type: "single",
        response: JSON.stringify({ message: "Hello, world!" })
      },
      [FIELD_NAME.IS_ACTIVATED]: true,
      [FIELD_NAME.SHOULD_PROMPT_RESPONSE]: true
    } as const satisfies FormFieldValues

    const b = {
      [FIELD_NAME.URL]: "https://example-url",
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.STATUS]: "200",
      [FIELD_NAME.RESPONSE_DELAY]: 0,
      [FIELD_NAME.RESPONSE]: {
        type: "single",
        response: JSON.stringify({ message: "hello, world!" })
      },
      [FIELD_NAME.IS_ACTIVATED]: true,
      [FIELD_NAME.SHOULD_PROMPT_RESPONSE]: true
    } as const satisfies FormFieldValues

    expect(isSameFormFieldValues(a, b)).toBe(false)
  })
})
