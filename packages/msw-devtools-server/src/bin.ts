import { Command } from "commander"
import packageJson from "package.json"

import { startServer } from "./server"

const program = new Command()

program
  .name(Object.keys(packageJson.bin)[0])
  .description(packageJson.description)
  .version(packageJson.version)
// .option(
//   "-p, --port <number>",
//   "The port number that the WebSocket server should listen to.",
//   "8080"
// )
// .option(
//   "-s, --script",
//   "If true, the plugin will generate the script for the mock handlers."
// )
// .option(
//   "-so, --scriptOutputPath <string>",
//   "The path to the output file where the mock request handlers will be written to. This option is only used if `generateScript` is true.",
//   '"./mock-list.(ts|mjs)"'
// )
// .option(
//   "-j, --json",
//   "If true, the plugin will generate the JSON file that has the list of mocks."
// )
// .option(
//   "-jo, --jsonOutputPath <string>",
//   "The path to the output file where the mock list JSON will be written to. This option is only used if `generateJson` is true.",
//   '"./mock-list.json"'
// )
//   .parse(process.argv)

// const options = program.opts<MSWDevtoolsServerOptions>()

// const port = Number(options.port || 8080)

startServer()
