import { http, HttpResponse } from "msw"
import { Controller, useForm } from "react-hook-form"

import { CodeEditor } from "~/components/CodeEditor"
import { useActivatedMockList } from "~/components/tabs/TabBody/ActivatedMockListTab"
import { useSettings } from "~/components/tabs/TabBody/SettingsTab"
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
          <select
            className='h-full border-r bg-slate-50 p-2 text-base uppercase text-slate-700'
            {...method.register(FIELD_NAME.METHOD, { required: true })}
          >
            {Object.values(METHOD_OPTION).map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
          <input
            className='h-full w-full bg-slate-50 p-2 text-base text-slate-700'
            type='text'
            placeholder='Type URL Here'
            {...method.register(FIELD_NAME.URL, { required: true })}
          />
        </div>
        <button
          className='button-lg h-full bg-blue-500 text-white hover:bg-blue-700 hover:text-white disabled:bg-slate-400'
          disabled={!method.formState.isValid}
        >
          Add
        </button>
      </div>
      <label className='mt-2 flex flex-1 flex-col'>
        Response
        <Controller
          name={FIELD_NAME.RESPONSE}
          control={method.control}
          rules={{ required: true }}
          render={({ field }) => (
            <CodeEditor className='mb-2 mt-1 h-full w-full' {...field} />
          )}
        />
      </label>
    </form>
  )
}
