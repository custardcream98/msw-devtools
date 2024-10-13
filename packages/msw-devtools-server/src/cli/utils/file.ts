import chokidar from "chokidar"
import type { JsonMock } from "core"
import fs from "fs"
import path from "path"

import { options } from "~/cli/program"
import { log } from "~/cli/utils/log"
import { parseJsonMockList } from "~/cli/utils/parseJsonMockList"

export const readMockListFile = () => {
  try {
    const rawMockList = fs.readFileSync(options.output, "utf-8")
    return parseJsonMockList(rawMockList)
  } catch (error) {
    return null
  }
}

export const updateMockListFile = (mockList: JsonMock[]) => {
  const dir = path.dirname(options.output)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(options.output, JSON.stringify(mockList, null, 2), {
    encoding: "utf-8"
  })
}

export const watchMockListFile = (callback: (mockList: JsonMock[]) => void) => {
  const watcher = chokidar.watch(options.output, {
    ignored: (path, stats) => stats?.isDirectory() || !path.endsWith(".json")
  })

  const handleChange = () => {
    try {
      const rawMockList = fs.readFileSync(options.output, "utf-8")
      const mockList = parseJsonMockList(rawMockList)

      callback(mockList)
    } catch (error) {
      log.error(`Failed to parse the mock list from ${options.output}`)
    }
  }

  watcher.on("change", handleChange)

  return () => {
    watcher.off("change", handleChange)
    watcher.close()
  }
}
