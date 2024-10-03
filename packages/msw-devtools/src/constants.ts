import {
  type JsonMock,
  METHOD_OPTION,
  type MethodOption,
  type StatusOption
} from "@custardcream/msw-devtools-core"

export const FIELD_NAME = {
  URL: "url",
  METHOD: "method",
  STATUS: "status",
  RESPONSE: "response",
  RESPONSE_DELAY: "responseDelay"
} as const

export type FieldName = (typeof FIELD_NAME)[keyof typeof FIELD_NAME]

export const METHOD_COLOR = {
  [METHOD_OPTION.GET]: "text-blue-600",
  [METHOD_OPTION.POST]: "text-green-600",
  [METHOD_OPTION.PUT]: "text-yellow-600",
  [METHOD_OPTION.DELETE]: "text-red-600",
  [METHOD_OPTION.PATCH]: "text-teal-500",
  [METHOD_OPTION.OPTIONS]: "text-purple-600",
  [METHOD_OPTION.HEAD]: "text-gray-600"
} as const

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

export type FormFieldResponseValue =
  | {
      type: "single"
      response: string
    }
  | {
      type: "sequential"
      response: string[]
    }

export type FormFieldValues = {
  [FIELD_NAME.URL]: string
  [FIELD_NAME.METHOD]: MethodOption
  [FIELD_NAME.STATUS]: StatusOption
  [FIELD_NAME.RESPONSE]: FormFieldResponseValue
  [FIELD_NAME.RESPONSE_DELAY]: number
}

/**
 * localStorage keys
 */
export const StorageKey = {
  OPEN: "OPEN",
  BUTTON_POSITION: "BUTTON_POSITION",
  HEIGHT: "HEIGHT",
  RESPONSE_DELAY: "RESPONSE_DELAY",
  DEFAULT_RESPONSE: "DEFAULT_RESPONSE",
  DEFAULT_URL: "DEFAULT_URL",
  FLOATING_BUTTON_OPACITY: "FLOATING_BUTTON_OPACITY",
  MOCK_LIST: "MOCK_LIST",
  TAB: "TAB",
  EDIT_STATE: "EDIT_STATE",
  SAVED_FORM_FIELD_VALUES: "SAVED_FORM_FIELD_VALUES",
  MOCK_LIST_SIDEBAR_OPEN: "MOCK_LIST_SIDEBAR_OPEN"
} as const

export const Tab = {
  AddMock: "tab.addMock",
  MockList: "tab.mockList",
  Settings: "tab.settings"
} as const

export type Tab = (typeof Tab)[keyof typeof Tab]

export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey]

export type StorageValueType = {
  [StorageKey.OPEN]: boolean
  [StorageKey.BUTTON_POSITION]: { x: number; y: number }
  [StorageKey.HEIGHT]: string
  [StorageKey.RESPONSE_DELAY]: number
  [StorageKey.DEFAULT_RESPONSE]: string | null
  [StorageKey.DEFAULT_URL]: string | null
  [StorageKey.FLOATING_BUTTON_OPACITY]: number
  [StorageKey.MOCK_LIST]: JsonMock[]
  [StorageKey.TAB]: Tab
  [StorageKey.EDIT_STATE]: FormFieldValues | null
  [StorageKey.SAVED_FORM_FIELD_VALUES]: FormFieldValues | null
  [StorageKey.MOCK_LIST_SIDEBAR_OPEN]: boolean
}
