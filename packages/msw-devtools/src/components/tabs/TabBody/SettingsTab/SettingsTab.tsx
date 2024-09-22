import { useId } from "react"

import { CodeEditor } from "~/components/CodeEditor"
import { ScrollList } from "~/components/ScrollList"

import { useSettings } from "./context"

export const SettingsTab = () => {
  const {
    defaultUrl,
    setDefaultUrl,
    defaultResponse,
    setDefaultResponse,
    floatingButtonOpacity,
    setFloatingButtonOpacity
  } = useSettings()

  const urlInputId = useId()
  const defaultResponseEditorId = useId()
  const floatingButtonOpacityId = useId()

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
      <label htmlFor={defaultResponseEditorId} className='mt-2 block'>
        <span className='block'>Set Default Response Body</span>
        <span>
          {
            "Tip: When editing the response body, you can automatically move the cursor using the $ (dollar sign) in the default values. When editing the response body, pressing Tab will automatically move the cursor to the next dollar sign."
          }
        </span>
      </label>
      <CodeEditor
        id={defaultResponseEditorId}
        className='mt-2 max-h-80 w-full'
        value={defaultResponse ?? ""}
        onChange={setDefaultResponse}
      />
      <label htmlFor={floatingButtonOpacityId} className='mt-2 block'>
        Set Devtools Toggle Button Opacity
      </label>
      <input
        id={floatingButtonOpacityId}
        type='range'
        min={0}
        max={1}
        step={0.01}
        value={floatingButtonOpacity}
        onChange={(event) => {
          const value = Number(event.currentTarget.value)

          setFloatingButtonOpacity(value)
        }}
      />
      <span>{floatingButtonOpacity}</span>
    </ScrollList>
  )
}
