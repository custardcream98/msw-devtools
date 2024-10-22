export type MSWDevtoolsServerOptions = {
  /**
   * The path to the output file where the mock list JSON will be written to
   *
   * @default "./mock-list.json"
   */
  output: string
  /**
   * Enable recursive watching of the directory.
   * Ignore this option when the output path is a file.
   *
   * @default false
   */
  recursive: boolean
}
