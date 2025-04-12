import { JsonMockResponseType } from "core"

import {
  fixJson,
  validate
} from "~/components/tabs/TabBody/AddMockTab/AddMockForm/utils"

describe("validate", () => {
  it("should return false if value is empty", () => {
    expect(validate("")).toBe(false)
  })

  it("should return true if value is parsable JSON", () => {
    expect(validate("{}")).toBe(true)
  })

  it("should return 'FIXABLE' if value is fixable JSON", () => {
    expect(validate("{")).toBe("FIXABLE")
  })
})

describe("fixJson", () => {
  it("should return fixed JSON if value is fixable", () => {
    expect(
      fixJson({
        type: JsonMockResponseType.single,
        response: "{"
      })
    ).toEqual({
      type: JsonMockResponseType.single,
      response: "{}"
    })
  })

  it("should return fixed JSON if value is sequential", () => {
    expect(
      fixJson({
        type: JsonMockResponseType.sequential,
        response: ["{"]
      })
    ).toEqual({
      type: JsonMockResponseType.sequential,
      response: ["{}"]
    })
  })
})
