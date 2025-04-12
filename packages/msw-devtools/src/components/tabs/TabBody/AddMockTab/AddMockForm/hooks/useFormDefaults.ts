import { JsonMockResponseType, MethodOption, StatusOption } from "core"
import { useMemo } from "react"

import { useDefaultResponseSettings } from "~/components/contexts/default-response"
import { useDefaultResponseDelaySettings } from "~/components/contexts/default-response-delay"
import { useDefaultUrlSettings } from "~/components/contexts/default-url"
import { FIELD_NAME, FormFieldValues, StorageKey } from "~/constants"
import { getLocalStorageItem } from "~/hooks/useLocalStorageState"

/**
 * 폼 기본값에 대한 상수 정의
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
 * 폼의 기본값을 관리하는 훅
 * - 로컬 스토리지에서 저장된 값 로드
 * - 기본 설정 적용
 * - 편집 모드 감지
 */
export function useFormDefaults() {
  const { defaultUrl } = useDefaultUrlSettings()
  const { defaultResponse } = useDefaultResponseSettings()
  const { defaultResponseDelay } = useDefaultResponseDelaySettings()

  // 기본값 계산
  const defaultValues = useMemo<FormFieldValues>(() => {
    const savedFormFieldValues = getLocalStorageItem(
      StorageKey.SAVED_FORM_FIELD_VALUES
    )

    return {
      [FIELD_NAME.URL]:
        savedFormFieldValues?.[FIELD_NAME.URL] ||
        defaultUrl ||
        DEFAULT_VALUES[FIELD_NAME.URL],
      [FIELD_NAME.METHOD]:
        savedFormFieldValues?.[FIELD_NAME.METHOD] ||
        DEFAULT_VALUES[FIELD_NAME.METHOD],
      [FIELD_NAME.STATUS]:
        savedFormFieldValues?.[FIELD_NAME.STATUS] ||
        DEFAULT_VALUES[FIELD_NAME.STATUS],
      [FIELD_NAME.RESPONSE]:
        savedFormFieldValues?.[FIELD_NAME.RESPONSE] ||
        (defaultResponse
          ? {
              type: "single" as const,
              response: defaultResponse
            }
          : DEFAULT_VALUES[FIELD_NAME.RESPONSE]),
      [FIELD_NAME.RESPONSE_DELAY]:
        savedFormFieldValues?.[FIELD_NAME.RESPONSE_DELAY] ||
        defaultResponseDelay ||
        DEFAULT_VALUES[FIELD_NAME.RESPONSE_DELAY],
      [FIELD_NAME.IS_ACTIVATED]:
        savedFormFieldValues?.[FIELD_NAME.IS_ACTIVATED] ||
        DEFAULT_VALUES[FIELD_NAME.IS_ACTIVATED],
      [FIELD_NAME.SHOULD_PROMPT_RESPONSE]:
        savedFormFieldValues?.[FIELD_NAME.SHOULD_PROMPT_RESPONSE] ||
        DEFAULT_VALUES[FIELD_NAME.SHOULD_PROMPT_RESPONSE]
    }
  }, [defaultResponse, defaultResponseDelay, defaultUrl])

  // 폼 초기값 설정
  const initialValues = useMemo(() => {
    const editStateLocal = getLocalStorageItem(StorageKey.EDIT_STATE)
    return {
      [FIELD_NAME.URL]:
        editStateLocal?.[FIELD_NAME.URL] || defaultValues[FIELD_NAME.URL],
      [FIELD_NAME.METHOD]:
        editStateLocal?.[FIELD_NAME.METHOD] || defaultValues[FIELD_NAME.METHOD],
      [FIELD_NAME.STATUS]:
        editStateLocal?.[FIELD_NAME.STATUS] || defaultValues[FIELD_NAME.STATUS],
      [FIELD_NAME.RESPONSE]:
        editStateLocal?.[FIELD_NAME.RESPONSE] ||
        defaultValues[FIELD_NAME.RESPONSE],
      [FIELD_NAME.RESPONSE_DELAY]:
        editStateLocal?.[FIELD_NAME.RESPONSE_DELAY] ||
        defaultValues[FIELD_NAME.RESPONSE_DELAY],
      [FIELD_NAME.IS_ACTIVATED]:
        editStateLocal?.[FIELD_NAME.IS_ACTIVATED] ||
        defaultValues[FIELD_NAME.IS_ACTIVATED],
      [FIELD_NAME.SHOULD_PROMPT_RESPONSE]:
        editStateLocal?.[FIELD_NAME.SHOULD_PROMPT_RESPONSE] ||
        defaultValues[FIELD_NAME.SHOULD_PROMPT_RESPONSE]
    }
  }, [defaultValues])

  return {
    defaultValues,
    initialValues
  }
}
