import type { JsonMock } from "core"
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
