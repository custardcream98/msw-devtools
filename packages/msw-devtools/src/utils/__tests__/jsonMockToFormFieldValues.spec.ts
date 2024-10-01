import { expect } from "vitest"

import { FIELD_NAME } from "~/constants"
import type { JsonMock } from "~/types"
import { jsonMockToFormFieldValues } from "~/utils/jsonMockToFormFieldValues"

describe("jsonMockToFormFieldValues", () => {
  it("should return a form field values typed object from the json mock (single)", () => {
    const jsonMock = {
      [FIELD_NAME.URL]: "https://test-url",
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.STATUS]: "200",
      [FIELD_NAME.RESPONSE]: {
        type: "single",
        response: { name: "John" }
      },
      [FIELD_NAME.RESPONSE_DELAY]: 1000,
      isActivated: true
    } as const satisfies JsonMock

    const result = jsonMockToFormFieldValues(jsonMock)

    expect(result).toMatchInlineSnapshot(`
      {
        "method": "get",
        "response": {
          "response": "{
        "name": "John"
      }",
          "type": "single",
        },
        "responseDelay": 1000,
        "status": "200",
        "url": "https://test-url",
      }
    `)
  })

  it("should return a form field values typed object from the json mock (sequential)", () => {
    const jsonMock = {
      [FIELD_NAME.URL]: "https://test-url",
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.STATUS]: "200",
      [FIELD_NAME.RESPONSE]: {
        type: "sequential",
        response: [{ name: "John" }, { age: 30 }]
      },
      [FIELD_NAME.RESPONSE_DELAY]: 1000,
      isActivated: true
    } as const satisfies JsonMock

    const result = jsonMockToFormFieldValues(jsonMock)

    expect(result).toMatchInlineSnapshot(`
      {
        "method": "get",
        "response": {
          "response": [
            "{
        "name": "John"
      }",
            "{
        "age": 30
      }",
          ],
          "type": "sequential",
        },
        "responseDelay": 1000,
        "status": "200",
        "url": "https://test-url",
      }
    `)
  })
})
