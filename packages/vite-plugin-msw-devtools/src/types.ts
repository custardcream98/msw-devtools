import type {
  CustomEventMap,
  InferCustomEventPayload,
  WebSocketCustomListener
} from "vite"

export type WebSocketListener<Key extends keyof CustomEventMap> =
  WebSocketCustomListener<InferCustomEventPayload<Key>>
