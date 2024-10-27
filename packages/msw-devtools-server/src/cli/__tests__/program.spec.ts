import fs from "fs"
import path from "path"

import { DEFAULT_OUTPUT, resolveOutput, resolveRecursive } from "~/cli/program"
import { log } from "~/cli/utils/log"

vi.mock("fs")

describe("resolveOutput", () => {
  describe("if fs.statSync returns something", () => {
    it("should return the output path if it's a file", () => {
      vi.mocked(fs.statSync).mockReturnValue({
        isDirectory: () => false
      } as fs.Stats)

      const OUTPUT = "path/to/something/mock-list.json"
      const result = resolveOutput(OUTPUT)

      expect(result).toEqual(path.resolve(OUTPUT))
    })

    it("should return the output path if it's a directory", () => {
      vi.mocked(fs.statSync).mockReturnValue({
        isDirectory: () => true
      } as fs.Stats)

      const OUTPUT = "path/to/something"
      const result = resolveOutput(OUTPUT)

      expect(result).toEqual(path.resolve(OUTPUT, "mock-list.json"))
    })
  })

  describe("if fs.statSync returns nothing (which means, there's no file or directory)", () => {
    it("should return the default output path", () => {
      vi.mocked(fs.statSync).mockReturnValue(undefined)

      const OUTPUT = "mock-list.json"
      const result = resolveOutput(OUTPUT)

      expect(result).toEqual(path.resolve(OUTPUT))
    })
  })
})

describe("resolveRecursive", () => {
  beforeEach(() => {
    vi.mock("~/cli/utils/log") // disable the log.error calls
  })

  it('should try to create the directory if "recursive" is true', () => {
    const OUTPUT = "path/to/something"
    const RECURSIVE = true

    resolveRecursive(OUTPUT, RECURSIVE)

    expect(fs.mkdirSync).toHaveBeenCalledWith(OUTPUT, { recursive: true })
  })

  it("should return true if the output is a directory and recursive is true", () => {
    const OUTPUT = "path/to/something"
    const RECURSIVE = true

    const result = resolveRecursive(OUTPUT, RECURSIVE)

    expect(result).toEqual(true)
  })

  it("should return true if the output is default path and recursive is true", () => {
    const RECURSIVE = true

    const result = resolveRecursive(DEFAULT_OUTPUT, RECURSIVE)

    expect(result).toEqual(true)
    expect(fs.mkdirSync).toHaveBeenCalledWith("./msw-mocks", {
      recursive: true
    })
  })

  it("should return false if the output is a directory and recursive is false", () => {
    const OUTPUT = "path/to/something"
    const RECURSIVE = false
    const result = resolveRecursive(OUTPUT, RECURSIVE)

    expect(result).toEqual(false)
  })

  it("should return false if the output is a file path and recursive is true", () => {
    const OUTPUT = "path/to/something.json"
    const RECURSIVE = true
    const result = resolveRecursive(OUTPUT, RECURSIVE)

    expect(result).toEqual(false)
    expect(log.error).toHaveBeenCalledOnce()
  })

  it("should return false if the output is a file path and recursive is false", () => {
    const OUTPUT = "path/to/something.json"
    const RECURSIVE = false
    const result = resolveRecursive(OUTPUT, RECURSIVE)

    expect(result).toEqual(false)
  })
})
