import fs from "fs"

import { removeMockListFile } from "~/cli/utils/file/remove"

vi.mock("fs")

describe("removeMockListFile", () => {
  it("should remove the file", () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)

    const MOCKED_PATH = "path/to/mock-list.json"

    removeMockListFile(MOCKED_PATH)

    expect(fs.rmSync).toHaveBeenCalledOnce()
    expect(fs.rmSync).toHaveBeenCalledWith(MOCKED_PATH)
  })

  it("should not remove the file if it does not exist", () => {
    const MOCKED_PATH = "path/to/mock-list.json"
    vi.mocked(fs.existsSync).mockReturnValue(false)

    removeMockListFile(MOCKED_PATH)

    expect(fs.rmSync).not.toHaveBeenCalled()
  })

  it("should not remove the file if it is not a JSON file", () => {
    const MOCKED_PATH = "path/to/mock-list.txt"

    removeMockListFile(MOCKED_PATH)

    expect(fs.rmSync).not.toHaveBeenCalled()
  })
})
