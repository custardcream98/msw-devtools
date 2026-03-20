import { type JsonMock, type StatusOption } from "core"

import type { FormFieldValues } from "~/types/form"

export type { FormFieldResponseValue, FormFieldValues } from "~/types/form"

export const DEVTOOLS_ROOT_ID = "msw-devtools"
export const PROMPT_CONTAINER_ID = "msw-devtools-prompt"

export const FIELD_NAME = {
  URL: "url",
  METHOD: "method",
  STATUS: "status",
  RESPONSE: "response",
  RESPONSE_DELAY: "responseDelay",
  IS_ACTIVATED: "isActivated",
  SHOULD_PROMPT_RESPONSE: "shouldPromptResponse"
} as const

export type FieldName = (typeof FIELD_NAME)[keyof typeof FIELD_NAME]

export const STATUS_NAME = {
  "200": "OK",
  "201": "Created",
  "400": "Bad Request",
  "401": "Unauthorized",
  "403": "Forbidden",
  "404": "Not Found",
  "500": "Server Error" // make it shorter
} as const satisfies Record<StatusOption, string>

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
  [StorageKey.HEIGHT]: number | null
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
