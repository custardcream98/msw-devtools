import fs from "fs"

import { getPluginOptions } from "~/options"
import { generateScript } from "~/script/generateScript"
import { WebSocketListener } from "~/types"
import { checkEslint } from "~/workspace/check-config-files"
import { eslint } from "~/workspace/eslint"
import { prettier } from "~/workspace/prettier"

export const mockList: WebSocketListener<"msw-devtools:mock-list:update"> =
  () =>
  async ({ mockList }) => {
    const options = getPluginOptions()

    if (mockList.length === 0) {
      fs.rmSync(options.jsonOutputPath, { force: true })
      fs.rmSync(options.scriptOutputPath, { force: true })

      return
    }

    if (options.generateJson) {
      fs.writeFileSync(
        options.jsonOutputPath,
        JSON.stringify(
          mockList.map(({ url, method, status, response }) => ({
            url,
            method,
            status,
            response:
              response.type === "single"
                ? response.response
                : response.response[0]
          })),
          null,
          2
        )
      )
    }

    if (options.generateScript) {
      const script = generateScript(mockList)

      fs.writeFileSync(options.scriptOutputPath, script)

      if (checkEslint()) {
        await eslint([options.scriptOutputPath])
      }

      await prettier(options.scriptOutputPath)
    }
  }
