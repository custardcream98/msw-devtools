export const METHOD_OPTION = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
  OPTIONS: "options",
  HEAD: "head"
} as const

export type MethodOption = (typeof METHOD_OPTION)[keyof typeof METHOD_OPTION]

export const STATUS_OPTION = {
  "200": "200",
  "201": "201",
  "400": "400",
  "401": "401",
  "403": "403",
  "404": "404",
  "500": "500"
} as const

export type StatusOption = (typeof STATUS_OPTION)[keyof typeof STATUS_OPTION]

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
