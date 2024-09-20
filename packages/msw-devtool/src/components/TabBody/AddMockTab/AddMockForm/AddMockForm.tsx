import { http, HttpResponse } from "msw"
import { useForm } from "react-hook-form"

import { useActivatedMockList } from "~/components/TabBody/ActivatedMockListTab/context"
import { getApi } from "~/lib/msw"

import {
  FIELD_NAME,
  FormFieldValues,
  METHOD_OPTION,
  STATUS_OPTION
} from "./form"

const DEFAULT_VALUES: FormFieldValues = {
  url: "",
  method: METHOD_OPTION.GET,
  status: STATUS_OPTION["200"],
  response: ""
}

export const AddMockForm = () => {
  const { addActivatedMock } = useActivatedMockList()
  const method = useForm<FormFieldValues>({
    defaultValues: DEFAULT_VALUES
  })

  return (
    <form
      className='msw-d-flex msw-d-h-full msw-d-flex-col'
      onSubmit={method.handleSubmit((formData) => {
        const api = getApi()

        try {
          const parsedResponse = JSON.parse(formData.response)
          api.use(
            http[formData[FIELD_NAME.METHOD]](formData.url, () => {
              return HttpResponse.json(parsedResponse)
            })
          )

          addActivatedMock(formData)
          method.reset(DEFAULT_VALUES)
        } catch (error) {
          console.error(error)
        }
      })}
    >
      <div className='msw-d-flex msw-d-items-center msw-d-overflow-hidden msw-d-rounded-lg msw-d-msw-border'>
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
      <label className='msw-d-mt-2 msw-d-flex msw-d-flex-1 msw-d-flex-col'>
        Response
        <textarea
          className='msw-d-textarea msw-d-mt-1 msw-d-h-full msw-d-w-full'
          placeholder='Type Response Here'
          {...method.register(FIELD_NAME.RESPONSE, { required: true })}
        />
      </label>
      <button
        className='msw-d-button-lg msw-d-mt-2 msw-d-bg-blue-500 msw-d-text-white hover:msw-d-bg-blue-700 hover:msw-d-text-white disabled:msw-d-bg-slate-400'
        disabled={!method.formState.isValid}
      >
        Add
      </button>
    </form>
  )
}
