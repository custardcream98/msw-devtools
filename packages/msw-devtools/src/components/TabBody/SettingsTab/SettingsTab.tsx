import { useId } from "react"

import { ScrollList } from "~/components/ScrollList"
import { CodeEditor } from "~/components/TabBody/AddMockTab/AddMockForm/CodeEditor"
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
        className='msw-d-w-full msw-d-p-2 msw-d-font-mono msw-d-msw-round-border'
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
      <CodeEditor
        id={responseInputId}
        className='msw-d-textarea msw-d-mt-2 msw-d-h-80 msw-d-w-full'
        value={defaultResponse ?? ""}
        onChange={setDefaultResponse}
      />
    </ScrollList>
  )
}
