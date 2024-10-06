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
