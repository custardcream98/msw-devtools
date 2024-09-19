import { http, HttpResponse } from "msw"
import { useState } from "react"
import { useForm } from "react-hook-form"

import {
  FIELD_NAME,
  FormFieldValues,
  METHOD_OPTION,
  STATUS_OPTION
} from "~/components/AddMockForm/form"
import { getApi } from "~/lib/msw"

const DEFAULT_VALUES: FormFieldValues = {
  url: "",
  method: METHOD_OPTION.GET,
  status: STATUS_OPTION["200"],
  response: ""
}

export const AddMockForm = () => {
  const [activatedMockList, setActivatedMockList] = useState<FormFieldValues[]>(
    []
  )
  const method = useForm<FormFieldValues>({
    defaultValues: DEFAULT_VALUES
  })

  return (
    <>
      <h2>Add Mock</h2>
      <form
        onSubmit={method.handleSubmit((formData) => {
          const api = getApi()

          api.use(
            http[formData[FIELD_NAME.METHOD]](formData.url, () => {
              return HttpResponse.json(JSON.parse(formData.response))
            })
          )

          setActivatedMockList((prev) => [...prev, formData])
          method.reset(DEFAULT_VALUES)
        })}
      >
        <label>
          URL
          <input
            className='msw-d-text-black'
            type='text'
            {...method.register(FIELD_NAME.URL)}
          />
        </label>
        <label>
          METHOD
          <select
            className='msw-d-text-black'
            {...method.register(FIELD_NAME.METHOD)}
          >
            {Object.values(METHOD_OPTION).map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>
        <label>
          RESPONSE
          <textarea
            className='msw-d-text-black'
            {...method.register(FIELD_NAME.RESPONSE)}
          />
        </label>
        <button disabled={!method.formState.isValid}>Add</button>
      </form>
      <h2>Activated Mocks</h2>
      <ul>
        {activatedMockList.map((mock) => (
          <li key={mock[FIELD_NAME.URL]}>
            <div>{mock[FIELD_NAME.URL]}</div>
            <div>{mock[FIELD_NAME.METHOD]}</div>
            <div>{mock[FIELD_NAME.STATUS]}</div>
            <div>{mock[FIELD_NAME.RESPONSE]}</div>
          </li>
        ))}
      </ul>
    </>
  )
}
