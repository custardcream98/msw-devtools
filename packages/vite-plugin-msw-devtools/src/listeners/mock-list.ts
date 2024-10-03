import fs from "fs"

import { getPluginOptions } from "~/options"
import { generateScript } from "~/script/generateScript"
import { WebSocketListener } from "~/types"
import { checkEslint, checkTypescript } from "~/workspace/check-config-files"
import { eslint } from "~/workspace/eslint"
import { prettier } from "~/workspace/prettier"

const isUsingTypescript = checkTypescript()

export const mockList: WebSocketListener<"msw-devtools:mock-list:update"> =
  () =>
  async ({ mockList }) => {
    const options = getPluginOptions()
    const defaultOutputPath =
      "mock-handlers." + (isUsingTypescript ? "ts" : "mjs")
    const fileName = options
      ? options.outputPath ?? defaultOutputPath
      : defaultOutputPath

    if (mockList.length === 0) {
      fs.rmSync(fileName)

      return
    }

    const script = generateScript(mockList)

    fs.writeFileSync(fileName, script)

    if (checkEslint()) {
      await eslint([fileName])
    }

    await prettier(fileName)
  }
