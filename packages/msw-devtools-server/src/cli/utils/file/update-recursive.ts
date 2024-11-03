import { isSameJsonMock, type JsonMock } from "core"
import path from "path"

import { options } from "~/cli/program"
import { removeMockListFile } from "~/cli/utils/file/remove"

import { getLookupKey, getMockFileLookupMap } from "./lookup"
import { readMockListFile } from "./read"
import { updateMockListFile } from "./update"

/**
 * Updates the mock list file searched recursively from the given directory.
 *
 * Used when the `--recursive` option is enabled.
 */
export const updateMockListFileRecursive = (
  mockList: JsonMock[],
  targetDirectory = options.output
) => {
  const lookupMap = getMockFileLookupMap(options.output)
  const currentMockFilePaths = new Set(Object.values(lookupMap))

  const batchedDiff = mockList.reduce<{
    added: JsonMock[]
    updated: Record<string, JsonMock[]>
  }>(
    (diff, mock) => {
      const lookupKey = getLookupKey(mock)
      const mockFilePath = lookupMap[lookupKey]

      currentMockFilePaths.delete(mockFilePath)

      if (!mockFilePath) {
        diff.added.push(mock)
        return diff
      }

      diff.updated = {
        ...diff.updated,
        [mockFilePath]: [...(diff.updated[mockFilePath] || []), mock]
      }

      return diff
    },
    {
      added: [],
      updated: {}
    }
  )

  for (const mockFilePath in batchedDiff.updated) {
    const comparedMockList = readMockListFile(mockFilePath)
    const mockListToUpdate = batchedDiff.updated[mockFilePath]

    const updatedMockList = [
      ...(comparedMockList?.filter((mock) =>
        mockListToUpdate.some((newMock) => !isSameJsonMock(mock, newMock))
      ) || []),
      ...mockListToUpdate
    ]

    updateMockListFile(updatedMockList, mockFilePath)
  }

  if (batchedDiff.added.length) {
    updateMockListFile(
      batchedDiff.added,
      path.resolve(targetDirectory, "mock-list.json")
    )
  }

  for (const deletedMockFilePath of currentMockFilePaths) {
    removeMockListFile(deletedMockFilePath)
  }
}
