import { isJsonMock, type JsonMock } from "core"

export const parseJsonMockList = (raw: string): JsonMock[] => {
  const parsed = JSON.parse(raw)

  if (Array.isArray(parsed) && parsed.every(isJsonMock)) {
    return parsed
  }

  throw new Error("Invalid JSON mock list")
}
