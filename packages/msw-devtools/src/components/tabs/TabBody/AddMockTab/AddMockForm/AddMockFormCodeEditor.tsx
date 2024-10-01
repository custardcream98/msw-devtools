import { type Control, Controller } from "react-hook-form"

import { CodeEditor } from "~/components/CodeEditor"
import { FIELD_NAME, type FormFieldValues } from "~/constants"
import { checkJSONFixable, checkJSONParsable } from "~/lib/json"

const validate = (value: string) => {
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
          if (value.type === "sequential") {
            const validateResults = value.response.map(validate)

            if (validateResults.some((result) => result === "FIXABLE")) {
              return "FIXABLE"
            }

            return validateResults.every((value) => value === true)
          }

          return validate(value.response)
        }
      }}
      render={({ field }) => {
        if (field.value.type === "sequential") {
          return (
            <div
              ref={field.ref}
              onBlur={field.onBlur}
              className='flex flex-1 gap-2 overflow-auto'
            >
              {field.value.response.map((value, index) => (
                <div key={index} className='mb-2 mt-2 w-full'>
                  <div className="mb-2 flex items-center gap-2 after:h-[2px] after:w-full after:bg-slate-300 after:content-['']">
                    <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-solid border-slate-400 text-xs text-slate-400'>
                      {index + 1}
                    </span>
                  </div>
                  <CodeEditor
                    className='min-w-[500px]'
                    value={value}
                    onChange={(value) => {
                      const newResponses = [...field.value.response]
                      newResponses[index] = value
                      field.onChange({
                        type: "sequential",
                        response: newResponses
                      })
                    }}
                  />
                </div>
              ))}
            </div>
          )
        }

        return (
          <CodeEditor
            className='mb-2 mt-2 flex-1'
            value={field.value.response}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
          />
        )
      }}
    />
  )
}
