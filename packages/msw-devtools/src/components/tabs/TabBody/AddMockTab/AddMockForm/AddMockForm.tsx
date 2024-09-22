import { clsx } from "clsx"
import { http, HttpResponse } from "msw"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { CodeEditor } from "~/components/CodeEditor"
import { useActivatedMockList } from "~/components/contexts/activated-mock-list"
import { useDefaultResponseSettings } from "~/components/contexts/default-response"
import { useDefaultUrlSettings } from "~/components/contexts/default-url"
import {
  FIELD_NAME,
  FormFieldValues,
  METHOD_OPTION,
  STATUS_OPTION
} from "~/constants"
import { getApi } from "~/lib/msw"

import { formFieldValuesToJsonMock } from "./utils"

const DEFAULT_VALUES: FormFieldValues = {
  [FIELD_NAME.URL]: "",
  [FIELD_NAME.METHOD]: METHOD_OPTION.GET,
  [FIELD_NAME.STATUS]: STATUS_OPTION["200"],
  [FIELD_NAME.RESPONSE]: ""
}

export const AddMockForm = () => {
  const { addActivatedMock } = useActivatedMockList()
  const { defaultUrl } = useDefaultUrlSettings()
  const { defaultResponse } = useDefaultResponseSettings()
  const method = useForm<FormFieldValues>({
    defaultValues: {
      ...DEFAULT_VALUES,
      [FIELD_NAME.URL]: defaultUrl ?? DEFAULT_VALUES[FIELD_NAME.URL],
      [FIELD_NAME.RESPONSE]:
        defaultResponse ?? DEFAULT_VALUES[FIELD_NAME.RESPONSE]
    }
  })

  const { t } = useTranslation()

  return (
    <form
      className='flex h-full flex-col'
      onSubmit={method.handleSubmit((formData) => {
        const api = getApi()

        try {
          const jsonMock = formFieldValuesToJsonMock(formData)
          api.use(
            http[formData[FIELD_NAME.METHOD]](formData[FIELD_NAME.URL], () => {
              return HttpResponse.json(jsonMock[FIELD_NAME.RESPONSE])
            })
          )

          addActivatedMock(jsonMock)
          method.reset()
        } catch (error) {
          alert(error)
        }
      })}
    >
      <div className='flex w-full shrink-0 items-center gap-2'>
        <div className='flex w-full items-center overflow-hidden font-mono msw-round-border'>
          <Controller
            name={FIELD_NAME.METHOD}
            control={method.control}
            rules={{ required: true }}
            render={({ field }) => (
              <select
                className={clsx(
                  "h-full border-r bg-slate-50 p-2 text-base font-semibold uppercase",
                  {
                    "text-blue-600": field.value === METHOD_OPTION.GET,
                    "text-green-600": field.value === METHOD_OPTION.POST,
                    "text-yellow-600": field.value === METHOD_OPTION.PUT,
                    "text-red-600": field.value === METHOD_OPTION.DELETE,
                    "text-teal-500": field.value === METHOD_OPTION.PATCH,
                    "text-purple-600": field.value === METHOD_OPTION.OPTIONS,
                    "text-gray-600": field.value === METHOD_OPTION.HEAD
                  }
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
          <input
            className='h-full w-full bg-slate-50 p-2 text-base text-slate-700'
            type='text'
            placeholder={t("tabs.addMock.url.placeholder")}
            {...method.register(FIELD_NAME.URL, { required: true })}
          />
        </div>
        <button
          className='button-lg h-full flex-shrink-0 bg-blue-600 text-white hover:bg-blue-800 hover:text-white disabled:bg-slate-400'
          disabled={!method.formState.isValid}
        >
          {t("tabs.addMock.submit")}
        </button>
      </div>
      <label className='mt-4 flex flex-1 flex-col'>
        Response Body (JSON)
        <Controller
          name={FIELD_NAME.RESPONSE}
          control={method.control}
          rules={{ required: true }}
          render={({ field }) => (
            <CodeEditor className='mb-2 mt-2 h-full w-full' {...field} />
          )}
        />
      </label>
    </form>
  )
}
