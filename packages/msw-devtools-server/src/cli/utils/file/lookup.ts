import type { JsonMock } from "core"
import fs from "fs"
import path from "path"

import { readMockListFile } from "./read"

export const getLookupKey = (mock: JsonMock) => {
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
