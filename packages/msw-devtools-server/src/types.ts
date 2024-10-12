export type MSWDevtoolsServerOptions = {
  /**
   * The port number that the WebSocket server should listen to.
   *
   * @default 8080
   */
  port: number
  /**
   * If true, the plugin will generate the script for the mock handlers.
   *
   * @default true
   */
  generateScript: boolean
  /**
   * The path to the output file where the mock request handlers will be written to.
   *
   * This option is only used if `generateScript` is true.
   *
   * @default "./mock-list.(ts|mjs)"
   */
  scriptOutputPath: string
  /**
   * If true, the plugin will generate the JSON file that has the list of mocks.
   *
   * @default false
   */
  generateJson: boolean
  /**
   * The path to the output file where the mock list JSON will be written to.
   *
   * This option is only used if `generateJson` is true.
   *
   * @default "./mock-list.json"
   */
  jsonOutputPath: string
}
