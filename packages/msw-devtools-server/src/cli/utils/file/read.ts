import type { JsonMock } from "core"
import fs from "fs"
import path from "path"

import { options } from "~/cli/program"
import { log } from "~/cli/utils/log"
import { parseJsonMockList } from "~/cli/utils/parseJsonMockList"

/**
 * Reads and parses a mock list file from the specified path
 *
 * @param filePath Path to the mock list JSON file (defaults to options.output)
 * @returns Parsed array of JsonMock objects or null if file cannot be read/parsed
 */
export const readMockListFile = (
  filePath = options.output
): JsonMock[] | null => {
  try {
    const rawMockList = fs.readFileSync(filePath, "utf-8")
    return parseJsonMockList(rawMockList)
  } catch (error) {
    log.error(
      `Error reading mock list from ${filePath}: ${error instanceof Error ? error.message : String(error)}`
    )
    return null
  }
}

/**
 * Reads mock list files recursively from the given directory and combines them
 *
 * Used when the `--recursive` option is enabled.
 *
 * @param directory Directory to scan for JSON files (defaults to options.output)
 * @returns Combined array of all JsonMock objects found in the directory tree
 */
export const readMockListFileRecursive = (
  directory = options.output
): JsonMock[] => {
  try {
    const mockList: JsonMock[] = []
    const files = fs.readdirSync(directory)

    for (const file of files) {
      const filePath = path.resolve(directory, file)

      try {
        const stats = fs.statSync(filePath)

        if (stats.isDirectory()) {
          // Recursively read mocks from subdirectory and add to results
          const subDirMocks = readMockListFileRecursive(filePath)
          mockList.push(...subDirMocks)
        } else if (stats.isFile() && file.endsWith(".json")) {
          // Read and parse JSON file
          const parsedMocks = readMockListFile(filePath)
          if (parsedMocks) {
            mockList.push(...parsedMocks)
          }
        }
      } catch (error) {
        // Log error but continue processing other files
        log.error(
          `Error processing file ${filePath}: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    }

    return mockList
  } catch (error) {
    log.error(
      `Error reading directory ${directory}: ${error instanceof Error ? error.message : String(error)}`
    )
    return []
  }
}
