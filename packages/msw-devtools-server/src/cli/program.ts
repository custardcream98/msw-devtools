import { Command } from "commander"
import fs from "fs"
import packageJson from "package.json"
import path from "path"

import type { MSWDevtoolsServerOptions } from "~/cli/types"

export const program = new Command()

program
  .name(Object.keys(packageJson.bin)[0])
  .description(packageJson.description)
  .version(packageJson.version)
  .option(
    "-o, --output <string>",
    "The path to the output file where the mock list JSON will be written to",
    '"./mock-list.json"'
  )
  .parse(process.argv)

const _options = program.opts<MSWDevtoolsServerOptions>()

const resolveOutputPath = (output: string) => {
  const stats = fs.statSync(output, {
    throwIfNoEntry: false
  })

  if (!stats || stats.isDirectory()) {
    return path.resolve(output, "mock-list.json")
  }

  return output
}

export const options: MSWDevtoolsServerOptions = {
  output: resolveOutputPath(_options.output)
}
