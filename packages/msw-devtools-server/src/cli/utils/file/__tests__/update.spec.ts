import fs from "fs"
import path from "path"

import { updateMockListFile } from "~/cli/utils/file/update"

vi.mock("fs")

vi.mock("~/cli/utils/parseJsonMockList", () => ({
  parseJsonMockList: vi.fn()
}))
vi.mock("~/cli/utils/file/lookup")
vi.mock("~/cli/utils/file/read")

describe("updateMockListFile", () => {
  const MOCKED_PATH = "path/to/mock-list.json"

  it("should write the mock list to the file", async () => {
    const mockList = [{ key: "value" }] as any

    updateMockListFile(mockList, MOCKED_PATH)

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      MOCKED_PATH,
      JSON.stringify(mockList, null, 2),
      {
        encoding: "utf-8"
      }
    )
  })

  it("should try to make directory if it does not exists", async () => {
    const mockList = [{ key: "value" }] as any
    vi.mocked(fs.existsSync).mockImplementation(() => false)

    updateMockListFile(mockList, MOCKED_PATH)

    expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(MOCKED_PATH), {
      recursive: true
    })
  })
})
