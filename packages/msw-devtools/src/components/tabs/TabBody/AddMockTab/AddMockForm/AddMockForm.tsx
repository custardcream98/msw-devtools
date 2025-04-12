import { clsx } from "clsx"
import { JsonMockResponseType, MethodOption, StatusOption } from "core"
import { jsonrepair } from "jsonrepair"
import { useEffect, useMemo } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { FaPlus } from "react-icons/fa6"

import { useDefaultResponseSettings } from "~/components/contexts/default-response"
import { useDefaultResponseDelaySettings } from "~/components/contexts/default-response-delay"
import { useDefaultUrlSettings } from "~/components/contexts/default-url"
import { useMockList } from "~/components/contexts/mock-list"
import { useTab } from "~/components/tabs/TabBar"
import {
  FIELD_NAME,
  type FormFieldResponseValue,
  type FormFieldValues,
  METHOD_COLOR,
  STATUS_COLOR,
  STATUS_NAME,
  StorageKey,
  Tab
} from "~/constants"
import {
  getLocalStorageItem,
  setLocalStorageItem,
  useLocalStorageState
} from "~/hooks/useLocalStorageState"
import { checkJSONFixable, checkJSONParsable } from "~/lib/json"
import { formFieldValuesToJsonMock } from "~/utils/formFieldValuesToJsonMock"
import { isSameFormFieldValues } from "~/utils/isSameFormFieldValues"

import { AddMockFormCodeEditor } from "./AddMockFormCodeEditor"

const DEFAULT_VALUES = {
  [FIELD_NAME.URL]: "",
  [FIELD_NAME.METHOD]: MethodOption.get,
  [FIELD_NAME.STATUS]: StatusOption["200"],
  [FIELD_NAME.RESPONSE]: {
    type: JsonMockResponseType.single,
    response: ""
  },
  [FIELD_NAME.RESPONSE_DELAY]: 0,
  [FIELD_NAME.SHOULD_PROMPT_RESPONSE]: false
} as const satisfies FormFieldValues

export const AddMockForm = () => {
  const { mockList, pushMock } = useMockList()
  const { defaultUrl } = useDefaultUrlSettings()
  const { defaultResponse } = useDefaultResponseSettings()
  const { defaultResponseDelay } = useDefaultResponseDelaySettings()
  const [editStateLocal, setEditStateLocal] = useLocalStorageState(
    StorageKey.EDIT_STATE,
    null
  )

  const savedFormFieldValues = useMemo(() => {
    return getLocalStorageItem(StorageKey.SAVED_FORM_FIELD_VALUES)
  }, [])

  const defaultValues: FormFieldValues = useMemo(
    () => ({
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
              type: "single",
              response: defaultResponse
            }
          : DEFAULT_VALUES[FIELD_NAME.RESPONSE]),
      [FIELD_NAME.RESPONSE_DELAY]:
        savedFormFieldValues?.[FIELD_NAME.RESPONSE_DELAY] ||
        defaultResponseDelay ||
        DEFAULT_VALUES[FIELD_NAME.RESPONSE_DELAY],
      [FIELD_NAME.SHOULD_PROMPT_RESPONSE]:
        savedFormFieldValues?.[FIELD_NAME.SHOULD_PROMPT_RESPONSE] ||
        DEFAULT_VALUES[FIELD_NAME.SHOULD_PROMPT_RESPONSE]
    }),
    [savedFormFieldValues, defaultResponse, defaultResponseDelay, defaultUrl]
  )
  const isEdit = !!editStateLocal
  const method = useForm<FormFieldValues>({
    defaultValues: {
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
        defaultValues[FIELD_NAME.RESPONSE_DELAY]
    }
  })

  const { t } = useTranslation()

  useEffect(() => {
    // save form field values to local storage
    // when unmounting
    return () => {
      const currentValues = method.getValues()
      const isEdit = getLocalStorageItem(StorageKey.EDIT_STATE)

      if (isEdit) {
        setEditStateLocal(currentValues)
        return
      }

      if (
        currentValues &&
        !isSameFormFieldValues(currentValues, defaultValues)
      ) {
        setLocalStorageItem(StorageKey.SAVED_FORM_FIELD_VALUES, currentValues)
      }
    }
  }, [method, defaultValues, setEditStateLocal])

  const response = useWatch({
    control: method.control,
    name: FIELD_NAME.RESPONSE
  })

  // wanted to use form's error, but it's not working
  const isFixable = useMemo(() => {
    if (response.type === JsonMockResponseType.sequential) {
      return response.response.some(isJSONFixable)
    }

    return isJSONFixable(response.response)
  }, [response])

  const submitButtonLabel = useMemo(() => {
    if (isFixable) {
      return t("tabs.addMock.autoFix")
    }

    if (isEdit) {
      return t("tabs.addMock.editSubmit")
    }

    return t("tabs.addMock.submit")
  }, [isFixable, isEdit, t])

  const reset = () => {
    setLocalStorageItem(StorageKey.SAVED_FORM_FIELD_VALUES, null)
    setEditStateLocal(null)
    method.reset(defaultValues)
  }

  const { setTab } = useTab()
  const submit = (formData: FormFieldValues) => {
    const jsonMock = formFieldValuesToJsonMock(formData)
    pushMock(jsonMock)
    reset()

    setTab(Tab.MockList, {
      prevEdited: jsonMock
    })
  }

  return (
    <form
      className='flex h-full flex-col'
      onSubmit={method.handleSubmit(
        (formData) => {
          try {
            const isDuplicate = mockList.some(
              (mock) =>
                mock[FIELD_NAME.URL] === formData[FIELD_NAME.URL] &&
                mock[FIELD_NAME.METHOD] === formData[FIELD_NAME.METHOD]
            )

            if (isDuplicate) {
              const isConfirmed = confirm(
                t("tabs.addMock.duplicateConfirmMessage")
              )
              if (!isConfirmed) {
                return
              }
            }

            submit(formData)
          } catch (error) {
            alert(error)
          }
        },
        (error) => {
          if (error[FIELD_NAME.RESPONSE]?.message === "FIXABLE") {
            const response = method.getValues(FIELD_NAME.RESPONSE)

            method.setValue(
              FIELD_NAME.RESPONSE,
              response.type === JsonMockResponseType.sequential
                ? {
                    type: response.type,
                    response: response.response.map((value) =>
                      isJSONFixable(value) ? jsonrepair(value) : value
                    )
                  }
                : {
                    type: "single",
                    response: jsonrepair(response.response)
                  },
              {
                shouldValidate: true
              }
            )

            return
          }
        }
      )}
    >
      <div
        className={clsx(
          "-mx-3 -mt-3 mb-3",
          "grid overflow-hidden transition-[grid-template-rows] duration-300",
          isEdit ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className='overflow-hidden'>
          <p className='bg-green-600 py-1 text-center text-xs font-bold uppercase text-white'>
            {t("tabs.addMock.editModeIndicator")}
          </p>
        </div>
      </div>
      <Controller
        name={FIELD_NAME.URL}
        control={method.control}
        rules={{
          required: true
        }}
        render={({ field }) => (
          <input
            className='w-full bg-slate-50 p-2 !font-mono msw-round-border [&[readonly]]:opacity-40'
            type='text'
            placeholder={t("tabs.addMock.url.placeholder")}
            readOnly={isEdit}
            {...field}
          />
        )}
      />
      <div className='mt-4 flex w-full shrink-0 items-center gap-2'>
        <div className='flex w-full items-center overflow-hidden !font-mono msw-round-border'>
          <Controller
            name={FIELD_NAME.METHOD}
            control={method.control}
            render={({ field }) => (
              <select
                className={clsx(
                  "h-full w-full border-r bg-slate-50 p-2 text-xs font-semibold uppercase",
                  METHOD_COLOR[field.value]
                )}
                {...field}
              >
                {Object.values(MethodOption).map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            )}
          />
          <Controller
            name={FIELD_NAME.STATUS}
            control={method.control}
            rules={{ required: true }}
            render={({ field }) => (
              <select
                className={clsx(
                  "h-full w-full border-r bg-slate-50 p-2 text-xs font-semibold",
                  STATUS_COLOR[field.value]
                )}
                {...field}
              >
                {Object.values(StatusOption).map((status) => (
                  <option key={status} value={status}>
                    {status} {STATUS_NAME[status]}
                  </option>
                ))}
              </select>
            )}
          />
          <Controller
            name={FIELD_NAME.RESPONSE_DELAY}
            control={method.control}
            render={({ field: { value, onChange, ...field } }) => (
              <label className='flex h-full w-full min-w-0 items-center bg-slate-50 text-xs'>
                <span className='ml-2 min-w-fit'>
                  {t("tabs.addMock.responseDelay.label")}
                </span>
                <input
                  className='min-w-2 flex-1 bg-transparent p-2 text-right !font-mono'
                  type='number'
                  step={0.1}
                  min={0}
                  value={value}
                  onChange={(e) => {
                    onChange(Number(e.target.value))
                  }}
                  {...field}
                />
              </label>
            )}
          />
        </div>
        <button
          type='submit'
          className={clsx(
            "button flex-shrink-0 text-xs text-white hover:text-white disabled:pointer-events-none disabled:bg-slate-400",
            isEdit
              ? "bg-green-600 hover:bg-green-600"
              : "bg-blue-600 hover:bg-blue-800"
          )}
          disabled={!method.formState.isValid && !isFixable}
        >
          {submitButtonLabel}
        </button>
        {isEdit && (
          <button
            type='button'
            className='button flex-shrink-0 bg-red-600 text-xs text-white hover:bg-red-800 hover:text-white'
            onClick={reset}
          >
            {t("tabs.addMock.cancelEdit")}
          </button>
        )}
      </div>
      <div className='mt-4 flex flex-1 flex-col'>
        <span className='flex items-center justify-between'>
          Response Body (JSON){" "}
          {response.type === JsonMockResponseType.sequential && (
            <span className='ml-2 mr-auto rounded-lg border-2 border-solid border-orange-500 px-2 py-1 !font-mono text-[0.65rem] font-semibold text-orange-500'>
              {t("tabs.addMock.sequentialBadge", {
                count: response.response.length
              })}
            </span>
          )}
          <button
            className='button hover:bg-slate-300 hover:text-slate-600'
            type='button'
            title={t("tabs.addMock.addResponseButton.title")}
            onClick={() => {
              const normalizedPrevResponse = normalizeResponse(
                method.getValues(FIELD_NAME.RESPONSE)
              )
              const normalizedDefaultResponse = normalizeResponse(
                defaultValues[FIELD_NAME.RESPONSE]
              )

              const nextResponse = {
                type: JsonMockResponseType.sequential,
                response: [
                  ...normalizedPrevResponse,
                  ...normalizedDefaultResponse
                ]
              } as const satisfies FormFieldResponseValue

              method.setValue(FIELD_NAME.RESPONSE, nextResponse, {
                shouldValidate: true
              })
            }}
          >
            <FaPlus size={16} />
          </button>
        </span>
        <AddMockFormCodeEditor control={method.control} />
      </div>
    </form>
  )
}

const isJSONFixable = (value: string) => {
  if (!checkJSONParsable(value) && checkJSONFixable(value)) {
    return true
  }
  return false
}

const normalizeResponse = (response: FormFieldResponseValue) => {
  return response.type === JsonMockResponseType.sequential
    ? response.response
    : [response.response]
}
