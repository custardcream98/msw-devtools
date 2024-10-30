import { isSameJsonMock, type JsonMock } from "core"
import fs from "fs"
import path from "path"

import { options } from "~/cli/program"
import { parseJsonMockList } from "~/cli/utils/parseJsonMockList"

export const readMockListFile = (path = options.output) => {
  try {
    const rawMockList = fs.readFileSync(path, "utf-8")
    return parseJsonMockList(rawMockList)
  } catch (error) {
    return null
  }
}

/**
 * Reads the mock list file recursively from the given directory.
 *
 * Used when the `--recursive` option is enabled.
 */
export const readMockListFileRecursive = (
  directory = options.output,
  mockList: JsonMock[] = []
) => {
  const files = fs.readdirSync(directory)

  for (const file of files) {
    const filePath = path.resolve(directory, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      readMockListFileRecursive(filePath, mockList)
    } else if (stats.isFile() && file.endsWith(".json")) {
      const rawMockList = fs.readFileSync(filePath, "utf-8")
      const parsedMockList = parseJsonMockList(rawMockList)
      mockList.push(...parsedMockList)
    }
  }

  return mockList
}

export const updateMockListFile = (
  mockList: JsonMock[],
  targetPath = options.output
) => {
  const dir = path.dirname(targetPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(targetPath, JSON.stringify(mockList, null, 2), {
    encoding: "utf-8"
  })
}

const getLookupKey = (mock: JsonMock) => {
  return `${mock.method}_${mock.url}`
}
export const getMockFileLookupMap = (
  directory: string,
  map: Record<string, string> = {}
) => {
  const files = fs.readdirSync(directory)

  for (const file of files) {
    const filePath = path.resolve(directory, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      getMockFileLookupMap(filePath, map)
    } else if (stats.isFile() && file.endsWith(".json")) {
      const comparedMockList = readMockListFile(filePath)
      comparedMockList?.forEach((mock) => {
        map[getLookupKey(mock)] = filePath
      })
    }
  }

  return map
}

/**
 * Updates the mock list file searched recursively from the given directory.
 *
 * Used when the `--recursive` option is enabled.
 */
export const updateMockListFileRecursive = (mockList: JsonMock[]) => {
  const lookupMap = getMockFileLookupMap(options.output)
  const batchedDiff = mockList.reduce<{
    added: JsonMock[]
    updated: Record<string, JsonMock[]>
  }>(
    (diff, mock) => {
      const lookupKey = getLookupKey(mock)
      const mockFilePath = lookupMap[lookupKey]

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
      path.resolve(options.output, "mock-list.json")
    )
  }
}
