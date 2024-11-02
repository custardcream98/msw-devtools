import fs from "fs"
import path from "path"

import { getLookupKey, getMockFileLookupMap } from "~/cli/utils/file/lookup"
import { readMockListFile } from "~/cli/utils/file/read"

vi.mock("fs")
vi.mock("~/cli/utils/file/read")

describe("getLookupKey", () => {
  it("should return a lookup key", () => {
    const result = getLookupKey({ method: "get", url: "/api" } as any)

    expect(result).toMatchInlineSnapshot(`"get_/api"`)
  })
})

describe("getMockFileLookupMap", () => {
  it("should return a lookup map of mock files", () => {
    const MOCKED_DIRECTORY = "path/to/dir"
    vi.mocked(fs.readdirSync).mockImplementation(((filePath: string) => {
      if (path.resolve(MOCKED_DIRECTORY, "subDir") === filePath) {
        return ["file2.json"]
      }

      return ["subDir", "file1.json"]
    }) as any)
    vi.mocked(fs.statSync).mockImplementation(((filePath: string) => {
      if (path.resolve(MOCKED_DIRECTORY, "subDir") === filePath) {
        return {
          isDirectory: () => true,
          isFile: () => false
        }
      }

      return {
        isDirectory: () => false,
        isFile: () => true
      }
    }) as any)
    vi.mocked(readMockListFile).mockImplementation(((filePath: string) => {
      if (filePath === path.resolve(MOCKED_DIRECTORY, "file1.json")) {
        return [{ method: "get", url: "/api/file1" }]
      }

      return [{ method: "post", url: "/api/file2" }]
    }) as any)

    const result = getMockFileLookupMap(MOCKED_DIRECTORY)

    expect(result).toStrictEqual({
      "get_/api/file1": path.resolve(MOCKED_DIRECTORY, "file1.json"),
      "post_/api/file2": path.resolve(MOCKED_DIRECTORY, "subDir/file2.json")
    })
  })
})
