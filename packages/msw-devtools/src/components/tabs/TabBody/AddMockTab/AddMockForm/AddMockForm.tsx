import { clsx } from "clsx"
import { jsonrepair } from "jsonrepair"
import { useEffect, useMemo } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { useDefaultResponseSettings } from "~/components/contexts/default-response"
import { useDefaultUrlSettings } from "~/components/contexts/default-url"
import { useMockList } from "~/components/contexts/mock-list"
import {
  FIELD_NAME,
  type FormFieldValues,
  METHOD_COLOR,
  METHOD_OPTION,
  STATUS_COLOR,
  STATUS_NAME,
  STATUS_OPTION
} from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import { checkJSONFixable, checkJSONParsable } from "~/lib/json"
import { activateMock } from "~/lib/msw"

import { AddMockFormCodeEditor } from "./AddMockFormCodeEditor"
import { formFieldValuesToJsonMock } from "./utils"

const DEFAULT_VALUES: FormFieldValues = {
  [FIELD_NAME.URL]: "",
  [FIELD_NAME.METHOD]: METHOD_OPTION.GET,
  [FIELD_NAME.STATUS]: STATUS_OPTION["200"],
  [FIELD_NAME.RESPONSE]: ""
}

export const AddMockForm = () => {
  const { addMock } = useMockList()
  const { defaultUrl } = useDefaultUrlSettings()
  const { defaultResponse } = useDefaultResponseSettings()
  const [editStateLocal, setEditStateLocal] =
    useLocalStorageState<FormFieldValues | null>("EDIT_STATE", null)

  const method = useForm<FormFieldValues>({
    defaultValues: {
      [FIELD_NAME.URL]:
        editStateLocal?.[FIELD_NAME.URL] ||
        defaultUrl ||
        DEFAULT_VALUES[FIELD_NAME.URL],
      [FIELD_NAME.METHOD]:
        editStateLocal?.[FIELD_NAME.METHOD] ||
        DEFAULT_VALUES[FIELD_NAME.METHOD],
      [FIELD_NAME.STATUS]:
        editStateLocal?.[FIELD_NAME.STATUS] ||
        DEFAULT_VALUES[FIELD_NAME.STATUS],
      [FIELD_NAME.RESPONSE]:
        editStateLocal?.[FIELD_NAME.RESPONSE] ||
        defaultResponse ||
        DEFAULT_VALUES[FIELD_NAME.RESPONSE]
    }
  })

  const { t } = useTranslation()

  useEffect(() => {
    return () => {
      setEditStateLocal(method.getValues())
    }
  }, [setEditStateLocal, method])

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

  const submit = (formData: FormFieldValues) => {
    const jsonMock = formFieldValuesToJsonMock(formData)
    activateMock(jsonMock)
    addMock(jsonMock)
    setEditStateLocal(null)
    method.reset()
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
      <div className='flex w-full shrink-0 items-center gap-2'>
        <div className='flex w-full items-center overflow-hidden !font-mono msw-round-border'>
          <Controller
            name={FIELD_NAME.METHOD}
            control={method.control}
            rules={{ required: true }}
            render={({ field }) => (
              <select
                className={clsx(
                  "h-full border-r bg-slate-50 p-2 text-xs font-semibold uppercase",
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
                  "h-full border-r bg-slate-50 p-2 text-xs font-semibold",
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
            name={FIELD_NAME.URL}
            control={method.control}
            rules={{ required: true }}
            render={({ field }) => (
              <input
                className='h-full w-full bg-slate-50 p-2 text-xs text-slate-700'
                type='text'
                placeholder={t("tabs.addMock.url.placeholder")}
                {...field}
              />
            )}
          />
        </div>
        <button
          className='button h-full flex-shrink-0 bg-blue-600 text-xs text-white hover:bg-blue-800 hover:text-white disabled:pointer-events-none disabled:bg-slate-400'
          disabled={!method.formState.isValid && !isFixable}
        >
          {isFixable ? t("tabs.addMock.autoFix") : t("tabs.addMock.submit")}
        </button>
      </div>
      <label className='mt-4 flex flex-1 flex-col'>
        <span>Response Body (JSON)</span>
        <AddMockFormCodeEditor control={method.control} />
      </label>
    </form>
  )
}
