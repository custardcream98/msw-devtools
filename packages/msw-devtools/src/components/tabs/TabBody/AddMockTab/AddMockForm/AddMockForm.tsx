import { clsx } from "clsx"
import { jsonrepair } from "jsonrepair"
import { useEffect, useMemo } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { useDefaultResponseSettings } from "~/components/contexts/default-response"
import { useDefaultResponseDelaySettings } from "~/components/contexts/default-response-delay"
import { useDefaultUrlSettings } from "~/components/contexts/default-url"
import { useMockList } from "~/components/contexts/mock-list"
import { useTab } from "~/components/tabs/TabBar"
import {
  FIELD_NAME,
  type FormFieldValues,
  METHOD_COLOR,
  METHOD_OPTION,
  STATUS_COLOR,
  STATUS_NAME,
  STATUS_OPTION,
  StorageKey,
  Tab
} from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import { checkJSONFixable, checkJSONParsable } from "~/lib/json"

import { AddMockFormCodeEditor } from "./AddMockFormCodeEditor"
import { formFieldValuesToJsonMock } from "./utils"

const DEFAULT_VALUES: FormFieldValues = {
  [FIELD_NAME.URL]: "",
  [FIELD_NAME.METHOD]: METHOD_OPTION.GET,
  [FIELD_NAME.STATUS]: STATUS_OPTION["200"],
  [FIELD_NAME.RESPONSE]: "",
  [FIELD_NAME.RESPONSE_DELAY]: 0
}

export const AddMockForm = () => {
  const { pushMock } = useMockList()
  const { defaultUrl } = useDefaultUrlSettings()
  const { defaultResponse } = useDefaultResponseSettings()
  const { defaultResponseDelay } = useDefaultResponseDelaySettings()
  const [editStateLocal, setEditStateLocal] = useLocalStorageState(
    StorageKey.EDIT_STATE,
    null
  )

  const defaultValues = useMemo(
    () => ({
      [FIELD_NAME.URL]: defaultUrl || DEFAULT_VALUES[FIELD_NAME.URL],
      [FIELD_NAME.METHOD]: DEFAULT_VALUES[FIELD_NAME.METHOD],
      [FIELD_NAME.STATUS]: DEFAULT_VALUES[FIELD_NAME.STATUS],
      [FIELD_NAME.RESPONSE]:
        defaultResponse || DEFAULT_VALUES[FIELD_NAME.RESPONSE],
      [FIELD_NAME.RESPONSE_DELAY]:
        defaultResponseDelay || DEFAULT_VALUES[FIELD_NAME.RESPONSE_DELAY]
    }),
    [defaultResponse, defaultResponseDelay, defaultUrl]
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
    return () => {
      const isUpdated = !isSameFormValues(defaultValues, method.getValues())
      if (isUpdated) {
        setEditStateLocal(method.getValues())
      }
    }
  }, [setEditStateLocal, method, defaultValues])

  const response = useWatch({
    control: method.control,
    name: FIELD_NAME.RESPONSE
  })

  // wanted to use form's error, but it's not working
  const isFixable = useMemo(() => {
    if (!checkJSONParsable(response) && checkJSONFixable(response)) {
      return true
    }
    return false
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
            submit(formData)
          } catch (error) {
            alert(error)
          }
        },
        (error) => {
          if (error[FIELD_NAME.RESPONSE]?.message === "FIXABLE") {
            method.setValue(
              FIELD_NAME.RESPONSE,
              jsonrepair(method.getValues().response),
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
        rules={{ required: true }}
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
            rules={{ required: true }}
            render={({ field }) => (
              <select
                className={clsx(
                  "h-full w-full border-r bg-slate-50 p-2 text-xs font-semibold uppercase",
                  METHOD_COLOR[field.value]
                )}
                {...field}
              >
                {Object.values(METHOD_OPTION).map((method) => (
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
                {Object.values(STATUS_OPTION).map((status) => (
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
            render={({ field }) => (
              <label className='flex h-full w-full min-w-0 items-center bg-slate-50 text-xs'>
                <span className='ml-2 min-w-fit'>
                  {t("tabs.addMock.responseDelay.label")}
                </span>
                <input
                  className='min-w-2 flex-1 bg-transparent p-2 text-right !font-mono'
                  type='number'
                  step={0.1}
                  min={0}
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
      <label className='mt-4 flex flex-1 flex-col'>
        <span>Response Body (JSON)</span>
        <AddMockFormCodeEditor control={method.control} />
      </label>
    </form>
  )
}

const isSameFormValues = (a: FormFieldValues, b: FormFieldValues) => {
  return (
    a[FIELD_NAME.URL] === b[FIELD_NAME.URL] &&
    a[FIELD_NAME.METHOD] === b[FIELD_NAME.METHOD] &&
    a[FIELD_NAME.STATUS] === b[FIELD_NAME.STATUS] &&
    a[FIELD_NAME.RESPONSE] === b[FIELD_NAME.RESPONSE] &&
    a[FIELD_NAME.RESPONSE_DELAY] === b[FIELD_NAME.RESPONSE_DELAY]
  )
}
