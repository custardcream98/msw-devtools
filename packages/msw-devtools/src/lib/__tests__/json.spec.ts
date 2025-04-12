import { checkJSONFixable, checkJSONParsable, isJSONFixable } from "~/lib/json"

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

describe("isJSONFixable", () => {
  it("should return true if the value is fixable to JSON", () => {
    const value = "{key: value}"
    expect(isJSONFixable(value)).toBe(true)
  })

  it("should return false if the value is not fixable to JSON", () => {
    const value = "{invalid::"
    expect(isJSONFixable(value)).toBe(false)
  })
})
