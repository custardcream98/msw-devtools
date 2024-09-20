import { useId } from "react"

import { ScrollList } from "~/components/ScrollList"
import { useSettings } from "~/components/TabBody/SettingsTab/context"

export const SettingsTab = () => {
  const { defaultUrl, setDefaultUrl, defaultResponse, setDefaultResponse } =
    useSettings()

  const urlInputId = useId()
  const responseInputId = useId()

  return (
    <ScrollList>
      <label htmlFor={urlInputId}>Set Default URL</label>
      <input
        id={urlInputId}
        type='text'
        className='msw-d-textarea msw-d-w-full'
        value={defaultUrl ?? ""}
        onChange={(event) => {
          event.preventDefault()

          const value = event.currentTarget.value

          setDefaultUrl(value)
        }}
      />
      <label htmlFor={responseInputId} className='msw-d-mt-2 msw-d-block'>
        <span className='msw-d-block'>Set Default Response Body</span>
        <span>
          {
            "TIP: When editing response body, you can automatically move the cursor when using the $ (dollar sign) in default values. When the cursor is focused on a $, pressing Tab will move it to the next dollar sign."
          }
        </span>
      </label>
      <textarea
        id={responseInputId}
        className='msw-d-textarea msw-d-mt-2 msw-d-h-32 msw-d-w-full'
        value={defaultResponse ?? ""}
        onChange={(event) => {
          event.preventDefault()

          const value = event.currentTarget.value

          setDefaultResponse(value)
        }}
      ></textarea>
    </ScrollList>
  )
}
