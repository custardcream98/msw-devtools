import { type JsonMock } from "core"
import fs from "fs"
import path from "path"

import { options } from "~/cli/program"

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
