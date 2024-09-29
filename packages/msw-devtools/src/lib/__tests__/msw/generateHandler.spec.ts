import { FIELD_NAME } from "~/constants"
import { generateHandler } from "~/lib/msw/generateHandler"

describe("generateMockRequestHandler", () => {
  it("should return a request handler", () => {
    const mock = {
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.URL]: "test-url",
      [FIELD_NAME.RESPONSE_DELAY]: 0,
      [FIELD_NAME.RESPONSE]: { test: "test" },
      [FIELD_NAME.STATUS]: "200",
      isActivated: true
    } as const

    const requestHandler = generateHandler(mock)
    expect(requestHandler).toMatchInlineSnapshot(`
      HttpHandler {
        "info": {
          "callFrame": "/Users/shiwoo/dev/msw-devtools/packages/msw-devtools/src/lib/msw/generateHandler.ts:7:38",
          "header": "GET test-url",
          "method": "GET",
          "path": "test-url",
        },
        "isUsed": false,
        "options": {},
        "resolver": [Function],
        "resolverIterator": undefined,
        "resolverIteratorResult": undefined,
      }
    `)
  })
})
