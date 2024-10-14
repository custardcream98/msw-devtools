export const JsonMockResponseType = {
  single: "single",
  sequential: "sequential"
} as const

export type JsonMockResponseType =
  (typeof JsonMockResponseType)[keyof typeof JsonMockResponseType]

export const MethodOption = {
  get: "get",
  post: "post",
  put: "put",
  patch: "patch",
  delete: "delete",
  options: "options",
  head: "head"
} as const

export type MethodOption = (typeof MethodOption)[keyof typeof MethodOption]

export const StatusOption = {
  "200": "200",
  "201": "201",
  "400": "400",
  "401": "401",
  "403": "403",
  "404": "404",
  "500": "500"
} as const

export type StatusOption = (typeof StatusOption)[keyof typeof StatusOption]

export const STATUS_NAME = {
  "200": "OK",
  "201": "Created",
  "400": "Bad Request",
  "401": "Unauthorized",
  "403": "Forbidden",
  "404": "Not Found",
  "500": "Server Error"
} as const satisfies Record<StatusOption, string>

export const MSWDevtoolsWebsocketEventName = {
  SYN: "msw-devtools:syn",
  ACK: "msw-devtools:ack",
  MOCK_LIST_UPDATE: "msw-devtools:mock-list:update"
} as const

export type MSWDevtoolsWebsocketEventName =
  (typeof MSWDevtoolsWebsocketEventName)[keyof typeof MSWDevtoolsWebsocketEventName]

export const MSW_DEVTOOLS_WEBSOCKET_SERVER_CONFIG = {
  PORT: 8080,
  PATH: "/__msw-devtools"
}

export const MSWDevtoolsClientType = {
  CLIENT: "CLIENT",
  SERVER_CLIENT: "SERVER_CLIENT"
} as const

export type MSWDevtoolsClientType =
  (typeof MSWDevtoolsClientType)[keyof typeof MSWDevtoolsClientType]
