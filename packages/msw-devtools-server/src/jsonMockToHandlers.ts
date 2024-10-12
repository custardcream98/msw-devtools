import { generateHandler, type JsonMock } from "core"
import type { HttpHandler } from "msw"

export type { JsonMock }
export const jsonMocksToHandlers = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonMocks: JsonMock[] | any
): HttpHandler[] => {
  return jsonMocks.map(generateHandler)
}
