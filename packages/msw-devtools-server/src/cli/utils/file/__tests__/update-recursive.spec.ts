import path from "path"

import * as lookup from "~/cli/utils/file/lookup"
import { readMockListFile } from "~/cli/utils/file/read"
import { removeMockListFile } from "~/cli/utils/file/remove"
import { updateMockListFile } from "~/cli/utils/file/update"
import { updateMockListFileRecursive } from "~/cli/utils/file/update-recursive"

vi.mock("fs")

vi.mock("~/cli/utils/parseJsonMockList", () => ({
  parseJsonMockList: vi.fn()
}))
vi.mock("~/cli/utils/file/read")
vi.mock("~/cli/utils/file/update")
vi.mock("~/cli/utils/file/remove")

describe("updateMockListFileRecursive", () => {
  const MOCKED_DIRECTORY = "path/to/dir"

  it("should update existing mock files and add new mock files", () => {
    const MOCKED_EXISTING_MOCK = { method: "get", url: "/api/file1" } as any
    const MOCKED_ADDED_MOCK = { method: "post", url: "/api/new-file" } as any
    const MOCKED_REMOVED_MOCK = { method: "post", url: "/api/removed" } as any
    const MOCKED_UPDATED_MOCK_LIST = [
      MOCKED_EXISTING_MOCK, // existing mock
      MOCKED_ADDED_MOCK // added mock
    ]

    const MOCKED_REMOVED_MOCK_LOOKUP_KEY =
      lookup.getLookupKey(MOCKED_REMOVED_MOCK)
    const MOCKED_EXISTING_MOCK_LOOKUP_KEY =
      lookup.getLookupKey(MOCKED_EXISTING_MOCK)

    const MOCKED_LOOKUP_MAP = {
      [MOCKED_EXISTING_MOCK_LOOKUP_KEY]: `${MOCKED_DIRECTORY}/file1.json`,
      [MOCKED_REMOVED_MOCK_LOOKUP_KEY]: `${MOCKED_DIRECTORY}/removed.json`
    }
    vi.spyOn(lookup, "getMockFileLookupMap").mockReturnValue(MOCKED_LOOKUP_MAP)
    vi.mocked(readMockListFile).mockImplementation(((filePath: string) => {
      if (MOCKED_EXISTING_MOCK_LOOKUP_KEY === filePath) {
        return [MOCKED_EXISTING_MOCK]
      }
      return null
    }) as any)

    updateMockListFileRecursive(MOCKED_UPDATED_MOCK_LIST, MOCKED_DIRECTORY)

    expect(updateMockListFile).toHaveBeenCalledWith(
      [MOCKED_EXISTING_MOCK],
      MOCKED_LOOKUP_MAP[MOCKED_EXISTING_MOCK_LOOKUP_KEY]
    )

    // The new mock file should be added.
    expect(updateMockListFile).toHaveBeenCalledWith(
      [MOCKED_ADDED_MOCK],
      path.resolve(MOCKED_DIRECTORY, "mock-list.json")
    )

    // The removed mock file should be removed.
    expect(removeMockListFile).toHaveBeenCalledWith(
      MOCKED_LOOKUP_MAP[MOCKED_REMOVED_MOCK_LOOKUP_KEY]
    )
  })
})
