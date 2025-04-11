import { isSameJsonMock, type JsonMock } from "core"
import path from "path"

import { options } from "~/cli/program"
import { removeMockListFile } from "~/cli/utils/file/remove"

import { getLookupKey, getMockFileLookupMap } from "./lookup"
import { readMockListFile } from "./read"
import { updateMockListFile } from "./update"

/**
 * Interface representing mock data changes (added, updated, deleted)
 */
interface MockListDiff {
  added: JsonMock[]
  updated: Record<string, JsonMock[]>
  deleted: Set<string>
}

/**
 * Calculates differences between the mock list and existing files
 */
function calculateMockListDiff(
  mockList: JsonMock[],
  lookupMap: Record<string, string>
): MockListDiff {
  const currentMockFilePaths = new Set(Object.values(lookupMap))

  const diff: MockListDiff = {
    added: [],
    updated: {},
    deleted: currentMockFilePaths
  }

  for (const mock of mockList) {
    const lookupKey = getLookupKey(mock)
    const mockFilePath = lookupMap[lookupKey]

    if (!mockFilePath) {
      // Newly added mock
      diff.added.push(mock)
      continue
    }

    // Mark this mock as not to be deleted
    diff.deleted.delete(mockFilePath)

    // Add to update list
    if (!diff.updated[mockFilePath]) {
      diff.updated[mockFilePath] = []
    }
    diff.updated[mockFilePath].push(mock)
  }

  return diff
}

/**
 * Processes mock files that need to be updated
 */
function processUpdatedMockFiles(updated: Record<string, JsonMock[]>): void {
  for (const mockFilePath in updated) {
    const existingMocks = readMockListFile(mockFilePath) || []
    const mocksToUpdate = updated[mockFilePath]

    // Filter out existing mocks that aren't in the update list
    // and add the new updates
    const updatedMockList = [
      ...existingMocks.filter(
        (mock) =>
          !mocksToUpdate.some((newMock) => isSameJsonMock(mock, newMock))
      ),
      ...mocksToUpdate
    ]

    updateMockListFile(updatedMockList, mockFilePath)
  }
}

/**
 * Processes newly added mocks
 */
function processAddedMocks(added: JsonMock[], targetDirectory: string): void {
  if (added.length) {
    updateMockListFile(added, path.resolve(targetDirectory, "mock-list.json"))
  }
}

/**
 * Processes mock files that need to be deleted
 */
function processDeletedMockFiles(deleted: Set<string>): void {
  for (const deletedMockFilePath of deleted) {
    removeMockListFile(deletedMockFilePath)
  }
}

/**
 * Updates the mock list file searched recursively from the given directory.
 *
 * Used when the `--recursive` option is enabled.
 */
export const updateMockListFileRecursive = (
  mockList: JsonMock[],
  targetDirectory = options.output
): void => {
  const lookupMap = getMockFileLookupMap(options.output)
  const diff = calculateMockListDiff(mockList, lookupMap)

  processUpdatedMockFiles(diff.updated)
  processAddedMocks(diff.added, targetDirectory)
  processDeletedMockFiles(diff.deleted)
}
