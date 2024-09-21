import { http, HttpResponse } from "msw"
import { Controller, useForm } from "react-hook-form"

import { useActivatedMockList } from "~/components/TabBody/ActivatedMockListTab/context"
import { CodeEditor } from "~/components/TabBody/AddMockTab/AddMockForm/CodeEditor"
import { useSettings } from "~/components/TabBody/SettingsTab/context"
import { getApi } from "~/lib/msw"

import {
  FIELD_NAME,
  FormFieldValues,
  METHOD_OPTION,
  STATUS_OPTION
} from "./form"
import { formFieldValuesToJsonMock } from "./utils"

const DEFAULT_VALUES: FormFieldValues = {
  [FIELD_NAME.URL]: "",
  [FIELD_NAME.METHOD]: METHOD_OPTION.GET,
  [FIELD_NAME.STATUS]: STATUS_OPTION["200"],
  [FIELD_NAME.RESPONSE]: ""
}

export const AddMockForm = () => {
  const { addActivatedMock } = useActivatedMockList()
  const { defaultUrl, defaultResponse } = useSettings()
  const method = useForm<FormFieldValues>({
    defaultValues: {
      ...DEFAULT_VALUES,
      [FIELD_NAME.URL]: defaultUrl ?? DEFAULT_VALUES[FIELD_NAME.URL],
      [FIELD_NAME.RESPONSE]:
        defaultResponse ?? DEFAULT_VALUES[FIELD_NAME.RESPONSE]
    }
  })

  return (
    <form
      className='msw-d-flex msw-d-h-full msw-d-flex-col'
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
      <div className='msw-d-flex msw-d-w-full msw-d-shrink-0 msw-d-items-center msw-d-gap-2'>
        <div className='msw-d-flex msw-d-w-full msw-d-items-center msw-d-overflow-hidden msw-d-font-mono msw-d-msw-round-border'>
          <select
            className='msw-d-h-full msw-d-border-r msw-d-bg-slate-50 msw-d-p-2 msw-d-text-base msw-d-uppercase msw-d-text-slate-700'
            {...method.register(FIELD_NAME.METHOD, { required: true })}
          >
            {Object.values(METHOD_OPTION).map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
          <input
            className='msw-d-h-full msw-d-w-full msw-d-bg-slate-50 msw-d-p-2 msw-d-text-base msw-d-text-slate-700'
            type='text'
            placeholder='Type URL Here'
            {...method.register(FIELD_NAME.URL, { required: true })}
          />
        </div>
        <button
          className='msw-d-button-lg msw-d-h-full msw-d-bg-blue-500 msw-d-text-white hover:msw-d-bg-blue-700 hover:msw-d-text-white disabled:msw-d-bg-slate-400'
          disabled={!method.formState.isValid}
        >
          Add
        </button>
      </div>
      <label className='msw-d-mt-2 msw-d-flex msw-d-flex-1 msw-d-flex-col'>
        Response
        <Controller
          name={FIELD_NAME.RESPONSE}
          control={method.control}
          rules={{ required: true }}
          render={({ field }) => (
            <CodeEditor
              className='msw-d-mb-2 msw-d-mt-1 msw-d-h-full msw-d-w-full'
              {...field}
            />
          )}
        />
      </label>
    </form>
  )
}
