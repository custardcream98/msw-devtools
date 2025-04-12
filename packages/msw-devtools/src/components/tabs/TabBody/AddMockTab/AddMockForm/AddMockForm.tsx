import { JsonMockResponseType } from "core"
import { useForm, useWatch } from "react-hook-form"

import type { FormFieldValues } from "~/constants"
import { FIELD_NAME } from "~/constants"

import { AddMockFormCodeEditor } from "./AddMockFormCodeEditor"
import { EditModeIndicator } from "./EditModeIndicator"
import { FormButtons } from "./FormButtons"
import {
  useFormDefaults,
  useFormPersistence,
  useFormSubmit,
  useJsonValidation,
  useResponseManagement
} from "./hooks"
import { RequestOptions } from "./RequestOptions"
import { ResponseBodyHeader } from "./ResponseBodyHeader"
import { ToggleOptions } from "./ToggleOptions"
import { URLField } from "./URLField"
import { fixJson } from "./utils"

/**
 * MSW Mock Creation Form Component
 * 1. Basic settings: URL, method, status code
 * 2. JSON response editing
 * 3. Form submission and saving
 */
export const AddMockForm = () => {
  const { initialValues, defaultValues } = useFormDefaults()

  const method = useForm<FormFieldValues>({
    defaultValues: initialValues
  })

  const response = useWatch({
    control: method.control,
    name: FIELD_NAME.RESPONSE
  })

  const { isFixable } = useJsonValidation({
    response
  })

  const { resetForm, isEdit } = useFormPersistence({
    method,
    defaultValues
  })

  const { addSequentialResponse } = useResponseManagement({
    method,
    defaultValues
  })

  const { handleValid, handleInvalid } = useFormSubmit({
    method,
    fixJson,
    resetForm
  })

  return (
    <form
      className='flex h-full flex-col'
      onSubmit={method.handleSubmit(handleValid, handleInvalid)}
    >
      <EditModeIndicator isEdit={isEdit} />

      <URLField control={method.control} isReadOnly={isEdit} />

      <ToggleOptions control={method.control} />

      <RequestOptions control={method.control} />

      <div className='mt-2 flex w-full shrink-0 items-center justify-end gap-2'>
        <FormButtons
          isEdit={isEdit}
          isValid={method.formState.isValid}
          isFixable={isFixable}
          onReset={resetForm}
        />
      </div>

      <div className='mt-4 flex flex-1 flex-col'>
        <ResponseBodyHeader
          onAddResponse={addSequentialResponse}
          {...(response.type === JsonMockResponseType.sequential
            ? {
                responseType: response.type,
                responseCount: response.response.length
              }
            : {
                responseType: response.type
              })}
        />
        <AddMockFormCodeEditor control={method.control} />
      </div>
    </form>
  )
}
