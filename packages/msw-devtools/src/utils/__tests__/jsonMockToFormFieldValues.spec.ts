import type { JsonMock } from "@custardcream/msw-devtools-core"
import { expect } from "vitest"

import { jsonMockToFormFieldValues } from "~/utils/jsonMockToFormFieldValues"

describe("jsonMockToFormFieldValues", () => {
  it("should return a form field values typed object from the json mock (single)", () => {
    const jsonMock = {
      url: "https://test-url",
      method: "get",
      status: "200",
      response: {
        type: "single",
        response: { name: "John" }
      },
      responseDelay: 1000,
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
      url: "https://test-url",
      method: "get",
      status: "200",
      response: {
        type: "sequential",
        response: [{ name: "John" }, { age: 30 }]
      },
      responseDelay: 1000,
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
