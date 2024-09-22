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

export type FormFieldValues = {
  [FIELD_NAME.URL]: string
  [FIELD_NAME.METHOD]: MethodOption
  [FIELD_NAME.STATUS]: StatusOption
  [FIELD_NAME.RESPONSE]: string
}
