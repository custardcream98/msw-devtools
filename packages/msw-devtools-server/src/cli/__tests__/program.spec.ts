import fs from "fs"
import path from "path"

import { resolveOutputPath } from "~/cli/program"

vi.mock("fs")

describe("resolveOutputPath", () => {
  describe("if fs.statSync returns something", () => {
    it("should return the output path if it's a file", () => {
      vi.mocked(fs.statSync).mockReturnValue({
        isDirectory: () => false
      } as fs.Stats)

      const OUTPUT = "path/to/something/mock-list.json"
      const result = resolveOutputPath(OUTPUT)

      expect(result).toEqual(path.resolve(OUTPUT))
    })

    it("should return the output path if it's a directory", () => {
      vi.mocked(fs.statSync).mockReturnValue({
        isDirectory: () => true
      } as fs.Stats)

      const OUTPUT = "path/to/something"
      const result = resolveOutputPath(OUTPUT)

      expect(result).toEqual(path.resolve(OUTPUT, "mock-list.json"))
    })
  })

  describe("if fs.statSync returns nothing (which means, there's no file or directory)", () => {
    it("should return the default output path", () => {
      vi.mocked(fs.statSync).mockReturnValue(undefined)

      const OUTPUT = "mock-list.json"
      const result = resolveOutputPath(OUTPUT)

      expect(result).toEqual(path.resolve(OUTPUT))
    })
  })
})
