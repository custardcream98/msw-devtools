import { JsonMockResponseType, MethodOption, StatusOption } from "core"
import { useMemo } from "react"

import { useDefaultResponseSettings } from "~/components/contexts/default-response"
import { useDefaultResponseDelaySettings } from "~/components/contexts/default-response-delay"
import { useDefaultUrlSettings } from "~/components/contexts/default-url"
import { FIELD_NAME, FormFieldValues, StorageKey } from "~/constants"
import { getLocalStorageItem } from "~/hooks/useLocalStorageState"

/**
 * null/undefined인 값을 건너뛰고 첫 번째 유효한 값을 반환.
 * `||`와 달리 0, false, "" 등 falsy 값을 정상으로 취급함.
 * 첫 번째 인자(fallback)는 반드시 non-nullable T여야 하므로 항상 반환값이 보장됨.
 */
export function resolveField<T>(
  fallback: T,
  ...candidates: (T | null | undefined)[]
): T {
  for (const candidate of candidates) {
    if (candidate != null) {
      return candidate
    }
  }
  return fallback
}

/**
 * Default values for the form
 */
export const DEFAULT_VALUES: FormFieldValues = {
  [FIELD_NAME.URL]: "",
  [FIELD_NAME.METHOD]: MethodOption.get,
  [FIELD_NAME.STATUS]: StatusOption["200"],
  [FIELD_NAME.RESPONSE]: {
    type: JsonMockResponseType.single,
    response: ""
  },
  [FIELD_NAME.RESPONSE_DELAY]: 0,
  [FIELD_NAME.IS_ACTIVATED]: true,
  [FIELD_NAME.SHOULD_PROMPT_RESPONSE]: false
} as const

/**
 * Hook to manage form default values
 * - Loads saved values from local storage
 * - Applies default settings
 * - Detects edit mode
 */
export function useFormDefaults() {
  const { defaultUrl } = useDefaultUrlSettings()
  const { defaultResponse } = useDefaultResponseSettings()
  const { defaultResponseDelay } = useDefaultResponseDelaySettings()

  // Calculate default values
  const defaultValues = useMemo<FormFieldValues>(() => {
    const savedFormFieldValues = getLocalStorageItem(
      StorageKey.SAVED_FORM_FIELD_VALUES
    )

    return {
      [FIELD_NAME.URL]: resolveField(
        DEFAULT_VALUES[FIELD_NAME.URL],
        savedFormFieldValues?.[FIELD_NAME.URL],
        defaultUrl
      ),
      [FIELD_NAME.METHOD]: resolveField(
        DEFAULT_VALUES[FIELD_NAME.METHOD],
        savedFormFieldValues?.[FIELD_NAME.METHOD]
      ),
      [FIELD_NAME.STATUS]: resolveField(
        DEFAULT_VALUES[FIELD_NAME.STATUS],
        savedFormFieldValues?.[FIELD_NAME.STATUS]
      ),
      [FIELD_NAME.RESPONSE]: resolveField(
        DEFAULT_VALUES[FIELD_NAME.RESPONSE],
        savedFormFieldValues?.[FIELD_NAME.RESPONSE],
        defaultResponse
          ? {
              type: "single" as const,
              response: defaultResponse
            }
          : null
      ),
      [FIELD_NAME.RESPONSE_DELAY]: resolveField(
        DEFAULT_VALUES[FIELD_NAME.RESPONSE_DELAY],
        savedFormFieldValues?.[FIELD_NAME.RESPONSE_DELAY],
        defaultResponseDelay
      ),
      [FIELD_NAME.IS_ACTIVATED]: resolveField(
        DEFAULT_VALUES[FIELD_NAME.IS_ACTIVATED],
        savedFormFieldValues?.[FIELD_NAME.IS_ACTIVATED]
      ),
      [FIELD_NAME.SHOULD_PROMPT_RESPONSE]: resolveField(
        DEFAULT_VALUES[FIELD_NAME.SHOULD_PROMPT_RESPONSE],
        savedFormFieldValues?.[FIELD_NAME.SHOULD_PROMPT_RESPONSE]
      )
    }
  }, [defaultResponse, defaultResponseDelay, defaultUrl])

  // Set initial form values
  const initialValues = useMemo(() => {
    const editStateLocal = getLocalStorageItem(StorageKey.EDIT_STATE)
    return {
      [FIELD_NAME.URL]: resolveField(
        defaultValues[FIELD_NAME.URL],
        editStateLocal?.[FIELD_NAME.URL]
      ),
      [FIELD_NAME.METHOD]: resolveField(
        defaultValues[FIELD_NAME.METHOD],
        editStateLocal?.[FIELD_NAME.METHOD]
      ),
      [FIELD_NAME.STATUS]: resolveField(
        defaultValues[FIELD_NAME.STATUS],
        editStateLocal?.[FIELD_NAME.STATUS]
      ),
      [FIELD_NAME.RESPONSE]: resolveField(
        defaultValues[FIELD_NAME.RESPONSE],
        editStateLocal?.[FIELD_NAME.RESPONSE]
      ),
      [FIELD_NAME.RESPONSE_DELAY]: resolveField(
        defaultValues[FIELD_NAME.RESPONSE_DELAY],
        editStateLocal?.[FIELD_NAME.RESPONSE_DELAY]
      ),
      [FIELD_NAME.IS_ACTIVATED]: resolveField(
        defaultValues[FIELD_NAME.IS_ACTIVATED],
        editStateLocal?.[FIELD_NAME.IS_ACTIVATED]
      ),
      [FIELD_NAME.SHOULD_PROMPT_RESPONSE]: resolveField(
        defaultValues[FIELD_NAME.SHOULD_PROMPT_RESPONSE],
        editStateLocal?.[FIELD_NAME.SHOULD_PROMPT_RESPONSE]
      )
    }
  }, [defaultValues])

  return {
    defaultValues,
    initialValues
  }
}
