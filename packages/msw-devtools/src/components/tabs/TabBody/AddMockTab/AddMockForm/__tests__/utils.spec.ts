import { validate } from "~/components/tabs/TabBody/AddMockTab/AddMockForm/utils"

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
