import { JsonMockResponseType } from "core"
import { type Control, Controller } from "react-hook-form"
import { FaXmark } from "react-icons/fa6"

import { CodeEditor } from "~/components/CodeEditor"
import { ResponseIndexBadge } from "~/components/ResponseIndexBadge"
import { FIELD_NAME, type FormFieldValues } from "~/constants"

import { validate, VALIDATION_RESULT } from "./utils"

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

            if (
              validateResults.some(
                (result) => result === VALIDATION_RESULT.FIXABLE
              )
            ) {
              return VALIDATION_RESULT.FIXABLE
            }

            return validateResults.every((value) => value === true)
          }

          return validate(value.response)
        }
      }}
      render={({ field }) => {
        const { value: currentResponse } = field

        if (currentResponse.type === "sequential") {
          return (
            <div
              ref={field.ref}
              onBlur={field.onBlur}
              className='flex flex-1 gap-2 overflow-auto'
            >
              {currentResponse.response.map((responseValue, index) => (
                <div key={index} className='mb-2 mt-2 w-full'>
                  <ResponseIndexBadge index={index} />
                  <div className='relative'>
                    <CodeEditor
                      className='min-w-[500px]'
                      value={responseValue}
                      onChange={(value) => {
                        const newResponses = [...currentResponse.response]
                        newResponses[index] = value
                        field.onChange({
                          type: "sequential",
                          response: newResponses
                        })
                      }}
                    />
                    <button
                      className='absolute right-2 top-2 cursor-pointer rounded p-1 text-slate-400 transition-colors duration-150 hover:bg-slate-200 hover:text-slate-600'
                      type='button'
                      onClick={() => {
                        const newResponses = currentResponse.response.toSpliced(
                          index,
                          1
                        )

                        field.onChange({
                          type:
                            newResponses.length > 1
                              ? JsonMockResponseType.sequential
                              : JsonMockResponseType.single,
                          response:
                            newResponses.length > 1
                              ? newResponses
                              : newResponses[0]
                        })
                      }}
                    >
                      <FaXmark size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        }

        return (
          <CodeEditor
            className='mb-2 mt-2 flex-1'
            value={currentResponse.response}
            onChange={(value) => {
              field.onChange({
                type: "single",
                response: value
              })
            }}
            onBlur={field.onBlur}
            ref={field.ref}
          />
        )
      }}
    />
  )
}
