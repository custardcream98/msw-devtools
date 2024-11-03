import fs from "fs"

export const removeMockListFile = (targetFilePath: string) => {
  if (!fs.existsSync(targetFilePath) || !targetFilePath.endsWith(".json")) {
    return
  }

  fs.rmSync(targetFilePath)
}
