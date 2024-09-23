export const FIELD_NAME = {
  URL: "url",
  METHOD: "method",
  STATUS: "status",
  RESPONSE: "response"
} as const

export type FieldName = (typeof FIELD_NAME)[keyof typeof FIELD_NAME]

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

export const METHOD_COLOR = {
  [METHOD_OPTION.GET]: "text-blue-600",
  [METHOD_OPTION.POST]: "text-green-600",
  [METHOD_OPTION.PUT]: "text-yellow-600",
  [METHOD_OPTION.DELETE]: "text-red-600",
  [METHOD_OPTION.PATCH]: "text-teal-500",
  [METHOD_OPTION.OPTIONS]: "text-purple-600",
  [METHOD_OPTION.HEAD]: "text-gray-600"
} as const

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
  "500": "Server Error" // make it shorter
} as const satisfies Record<StatusOption, string>

export const STATUS_COLOR = {
  "200": "text-green-700",
  "201": "text-green-700",
  "400": "text-red-700",
  "401": "text-red-700",
  "403": "text-red-700",
  "404": "text-red-700",
  "500": "text-red-700"
} as const

export type FormFieldValues = {
  [FIELD_NAME.URL]: string
  [FIELD_NAME.METHOD]: MethodOption
  [FIELD_NAME.STATUS]: StatusOption
  [FIELD_NAME.RESPONSE]: string
}
