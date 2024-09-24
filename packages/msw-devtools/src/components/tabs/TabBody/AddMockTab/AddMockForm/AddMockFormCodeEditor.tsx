import { type Control, Controller } from "react-hook-form"

import { CodeEditor } from "~/components/CodeEditor"
import { FIELD_NAME, type FormFieldValues } from "~/constants"
import { checkJSONFixable, checkJSONParsable } from "~/lib/json"

export const AddMockFormCodeEditor = ({
  control
}: {
  control: Control<FormFieldValues>
}) => {
  return (
    <Controller
      name={FIELD_NAME.RESPONSE}
      control={control}
      rules={{
        validate: (value) => {
          if (!value) {
            return false
          }

          if (checkJSONParsable(value)) {
            return true
          }

          if (checkJSONFixable(value)) {
            return "FIXABLE"
          }

          return false
        }
      }}
      render={({ field }) => (
        <CodeEditor className='mb-2 mt-2 h-full w-full' {...field} />
      )}
    />
  )
}
