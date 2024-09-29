import { checkJSONFixable, checkJSONParsable } from "~/lib/json"

describe("checkJSONParsable", () => {
  it("should return true if the value is a valid JSON", () => {
    const value = '{"key": "value"}'
    expect(checkJSONParsable(value)).toBe(true)
  })

  it("should return false if the value is not a valid JSON", () => {
    const value = "invalid-json"
    expect(checkJSONParsable(value)).toBe(false)
  })
})

describe("checkJSONFixable", () => {
  it("should return true if the value is a valid JSON", () => {
    const value = '{"key": "value"}'
    expect(checkJSONFixable(value)).toBe(true)
  })

  it("should return true if the value fixable to JSON", () => {
    const value = "{key: value}"
    expect(checkJSONFixable(value)).toBe(true)
  })
})
