import type {
  CustomEventMap,
  InferCustomEventPayload,
  WebSocketCustomListener,
  WebSocketServer
} from "vite"

export type WebSocketListener<Key extends keyof CustomEventMap> = (
  ws: WebSocketServer
) => WebSocketCustomListener<InferCustomEventPayload<Key>>

export type PluginOptions = {
  /**
   * The path to the output file where the mock request handlers will be written to.
   *
   * @default "mock-list.(ts|mjs)"
   */
  outputPath?: string
}
