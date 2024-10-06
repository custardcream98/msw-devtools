import type { JsonMock } from "core"

export const isSameJsonMock = (a: JsonMock, b: JsonMock) => {
  return a.url === b.url && a.method === b.method
}
