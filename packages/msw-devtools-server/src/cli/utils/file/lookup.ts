import type { JsonMock } from "core"
import fs from "fs"
import path from "path"

import { log } from "~/cli/utils/log"

import { readMockListFile } from "./read"

/**
 * Creates a unique lookup key for a mock based on its method and URL
 *
 * @returns A string in the format of `${method}_${url}`
 */
export const getLookupKey = (mock: JsonMock): string => {
  return `${mock.method}_${mock.url}`
}

/**
 * Recursively scans a directory for JSON files containing mock definitions
 * and creates a lookup map with keys generated from the mock objects.
 *
 * The function builds a map where:
 * - Keys are generated using `getLookupKey()`
 * - Values are the full paths to the JSON files containing the mock
 *
 * @param directory The directory to scan for mock JSON files
 * @param map Optional existing map to extend (used in recursion)
 * @returns A map of mock lookup keys to their file paths
 */
export const getMockFileLookupMap = (
  directory: string,
  map: Record<string, string> = {}
): Record<string, string> => {
  try {
    const files = fs.readdirSync(directory)

    const newMap = { ...map }

    for (const file of files) {
      const filePath = path.resolve(directory, file)

      try {
        const stats = fs.statSync(filePath)

        if (stats.isDirectory()) {
          // Merge results from recursive calls instead of mutating the map
          Object.assign(newMap, getMockFileLookupMap(filePath, newMap))
        } else if (stats.isFile() && file.endsWith(".json")) {
          const mockList = readMockListFile(filePath)

          if (mockList) {
            mockList.forEach((mock) => {
              newMap[getLookupKey(mock)] = filePath
            })
          }
        }
      } catch (error) {
        log.error(
          `Error processing file ${filePath}: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    }

    return newMap
  } catch (error) {
    log.error(
      `Error reading directory ${directory}: ${error instanceof Error ? error.message : String(error)}`
    )
    return map // Return the original map if directory reading fails
  }
}
