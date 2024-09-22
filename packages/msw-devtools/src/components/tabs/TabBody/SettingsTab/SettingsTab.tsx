import { useId } from "react"

import { CodeEditor } from "~/components/CodeEditor"
import { ScrollList } from "~/components/ScrollList"

import { useSettings } from "./context"

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
        className='w-full p-2 font-mono msw-round-border'
        value={defaultUrl ?? ""}
        onChange={(event) => {
          event.preventDefault()

          const value = event.currentTarget.value

          setDefaultUrl(value)
        }}
      />
      <label htmlFor={responseInputId} className='mt-2 block'>
        <span className='block'>Set Default Response Body</span>
        <span>
          {
            "Tip: When editing the response body, you can automatically move the cursor using the $ (dollar sign) in the default values. When editing the response body, pressing Tab will automatically move the cursor to the next dollar sign."
          }
        </span>
      </label>
      <CodeEditor
        id={responseInputId}
        className='textarea mt-2 h-80 w-full'
        value={defaultResponse ?? ""}
        onChange={setDefaultResponse}
      />
    </ScrollList>
  )
}
