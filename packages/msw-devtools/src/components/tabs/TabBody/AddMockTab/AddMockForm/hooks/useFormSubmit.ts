import { useCallback } from "react"
import { FieldErrors, UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { useMockList } from "~/components/contexts/mock-list"
import { useTab } from "~/components/tabs/TabBar"
import {
  FIELD_NAME,
  FormFieldResponseValue,
  FormFieldValues,
  Tab
} from "~/constants"
import { formFieldValuesToJsonMock } from "~/utils/formFieldValuesToJsonMock"

interface UseFormSubmitProps {
  method: UseFormReturn<FormFieldValues>
  fixJson: (response: FormFieldResponseValue) => FormFieldResponseValue
  resetForm: () => void
}

/**
 * 폼 제출 로직을 담당하는 훅
 * - 폼 데이터 처리
 * - 중복 체크
 * - 에러 처리
 * - JSON 자동 수정
 */
export function useFormSubmit({
  method,
  fixJson,
  resetForm
}: UseFormSubmitProps) {
  const { t } = useTranslation()
  const { mockList, pushMock } = useMockList()
  const { setTab } = useTab()

  /**
   * 폼 데이터 처리 및 제출
   */
  const submit = useCallback(
    (formData: FormFieldValues) => {
      const jsonMock = formFieldValuesToJsonMock(formData)
      pushMock(jsonMock)
      resetForm()

      // 탭 전환
      setTab(Tab.MockList, {
        prevEdited: jsonMock
      })
    },
    [pushMock, resetForm, setTab]
  )

  const handleValid = useCallback(
    (formData: FormFieldValues) => {
      try {
        // 중복 체크
        const isDuplicate = mockList.some(
          (mock) =>
            mock[FIELD_NAME.URL] === formData[FIELD_NAME.URL] &&
            mock[FIELD_NAME.METHOD] === formData[FIELD_NAME.METHOD]
        )

        if (isDuplicate) {
          const isConfirmed = confirm(t("tabs.addMock.duplicateConfirmMessage"))
          if (!isConfirmed) {
            return
          }
        }

        submit(formData)
      } catch (error) {
        alert(error)
      }
    },
    [mockList, submit, t]
  )

  const handleInvalid = useCallback(
    (error: FieldErrors<FormFieldValues>) => {
      if (error[FIELD_NAME.RESPONSE]?.message === "FIXABLE") {
        const response = method.getValues(FIELD_NAME.RESPONSE)
        const fixedResponse = fixJson(response)

        method.setValue(FIELD_NAME.RESPONSE, fixedResponse, {
          shouldValidate: true
        })
      }
    },
    [fixJson, method]
  )

  return {
    submit,
    handleValid,
    handleInvalid
  }
}
