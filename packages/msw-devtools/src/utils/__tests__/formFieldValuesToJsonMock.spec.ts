import { expect } from "vitest"

import { FIELD_NAME, type FormFieldValues } from "~/constants"
import { formFieldValuesToJsonMock } from "~/utils/formFieldValuesToJsonMock"

describe("formFieldValuesToJsonMock", () => {
  it("should return a JsonMock typed object from the form field values (single)", () => {
    const formData = {
      [FIELD_NAME.URL]: "https://test-url",
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.STATUS]: "200",
      [FIELD_NAME.RESPONSE]: {
        type: "single",
        response: '{"name":"John"}'
      },
      [FIELD_NAME.RESPONSE_DELAY]: 1000,
      [FIELD_NAME.SHOULD_PROMPT_RESPONSE]: true,
      [FIELD_NAME.IS_ACTIVATED]: true
    } as const satisfies FormFieldValues

    const result = formFieldValuesToJsonMock(formData)

    expect(result).toMatchInlineSnapshot(`
      {
        "isActivated": true,
        "method": "get",
        "response": {
          "response": {
            "name": "John",
          },
          "type": "single",
        },
        "responseDelay": 1000,
        "shouldPromptResponse": true,
        "status": "200",
        "url": "https://test-url",
      }
    `)
  })

  it("should return a JsonMock typed object from the form field values (sequential)", () => {
    const formData = {
      [FIELD_NAME.URL]: "https://test-url",
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.STATUS]: "200",
      [FIELD_NAME.RESPONSE]: {
        type: "sequential",
        response: ['{"name":"John"}', '{"age":30}']
      },
      [FIELD_NAME.RESPONSE_DELAY]: 1000,
      [FIELD_NAME.SHOULD_PROMPT_RESPONSE]: true,
      [FIELD_NAME.IS_ACTIVATED]: true
    } as const satisfies FormFieldValues

    const result = formFieldValuesToJsonMock(formData)

    expect(result).toMatchInlineSnapshot(`
      {
        "isActivated": true,
        "method": "get",
        "response": {
          "response": [
            {
              "name": "John",
            },
            {
              "age": 30,
            },
          ],
          "type": "sequential",
        },
        "responseDelay": 1000,
        "shouldPromptResponse": true,
        "status": "200",
        "url": "https://test-url",
      }
    `)
  })
})
