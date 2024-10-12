import chokidar from "chokidar"
import type { JsonMock } from "core"
import fs from "fs"

import { log } from "~/cli/utils/log"
import { parseJsonMockList } from "~/cli/utils/parseJsonMockList"

export const readMockListFile = (mockListJsonPath: string) => {
  try {
    const rawMockList = fs.readFileSync(mockListJsonPath, "utf-8")
    return parseJsonMockList(rawMockList)
  } catch (error) {
    return null
  }
}

export const updateMockListFile =
  (mockListJsonPath: string) => (mockList: JsonMock[]) => {
    fs.writeFileSync(mockListJsonPath, JSON.stringify(mockList, null, 2))
  }

export const watchMockListFile = (
  mockListJsonPath: string,
  callback: (mockList: JsonMock[]) => void
) => {
  const watcher = chokidar.watch(mockListJsonPath, {
    ignored: (path, stats) => stats?.isDirectory() || !path.endsWith(".json")
  })

  const handleChange = () => {
    try {
      const rawMockList = fs.readFileSync(mockListJsonPath, "utf-8")
      const mockList = parseJsonMockList(rawMockList)

      callback(mockList)
    } catch (error) {
      log.error(`Failed to parse the mock list from ${mockListJsonPath}`)
    }
  }

  watcher.on("change", handleChange)

  return () => {
    watcher.off("change", handleChange)
    watcher.close()
  }
}
