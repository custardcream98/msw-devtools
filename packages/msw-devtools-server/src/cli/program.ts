import { Command } from "commander"
import fs from "fs"
import packageJson from "package.json"
import path from "path"

import type { MSWDevtoolsServerOptions } from "~/cli/types"
import { log } from "~/cli/utils/log"

export const program = new Command()

export const DEFAULT_OUTPUT = "./mock-list.json"

program
  .name(Object.keys(packageJson.bin)[0])
  .description(packageJson.description)
  .version(packageJson.version)
  .option(
    "-o, --output <string>",
    "The path to the output file where the mock list JSON will be written to",
    DEFAULT_OUTPUT
  )
  .option(
    "-r, --recursive",
    "Enable recursive watching of the directory. This is useful when you want to manage multiple mock list files in a directory. You should use this option when the output path is a directory, otherwise, it will be ignored.",
    false
  )
  .parse(process.argv)

const _options = program.opts<MSWDevtoolsServerOptions>()

export const resolveOutput = (output: string) => {
  const stats = fs.statSync(output, {
    throwIfNoEntry: false
  })

  if (stats?.isDirectory()) {
    return path.resolve(output, "mock-list.json")
  }

  return path.resolve(output)
}

export const resolveRecursive = (output: string, recursive: boolean) => {
  if (recursive) {
    const parsedPath = path.parse(output)

    if (parsedPath.ext && output !== DEFAULT_OUTPUT) {
      log.error(
        'The "recursive" option is ignored when the output path isn\'t a directory. Please provide a directory path as the output.'
      )

      return false
    }

    const directory = `${parsedPath.dir}${output === DEFAULT_OUTPUT ? "/msw-mocks" : `/${parsedPath.base}`}`

    fs.mkdirSync(directory, {
      recursive: true
    })

    return true
  }

  return false
}

const _resolvedOutput = resolveOutput(_options.output)
const _resolvedRecursive = resolveRecursive(_options.output, _options.recursive)
export const options: MSWDevtoolsServerOptions = {
  output: _resolvedOutput,
  recursive: _resolvedRecursive
}
