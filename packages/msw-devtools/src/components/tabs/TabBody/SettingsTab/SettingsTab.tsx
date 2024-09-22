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
      <label htmlFor={urlInputId}>Default URL</label>
      <input
        id={urlInputId}
        type='text'
        className='mt-2 w-full p-2 font-mono msw-round-border'
        placeholder='Type URL Here'
        value={defaultUrl ?? ""}
        onChange={(event) => {
          event.preventDefault()

          const value = event.currentTarget.value

          setDefaultUrl(value)
        }}
      />
      <label htmlFor={defaultResponseEditorId} className='mt-4 block'>
        <span className='block'>Default Response Body</span>
        <blockquote className='blockquote mt-1 text-sm'>
          {
            "Tip: When editing the response body, you can automatically move the cursor using the $ (dollar sign) in the default values. When editing the response body, pressing Tab will automatically move the cursor to the next dollar sign."
          }
        </blockquote>
      </label>
      <CodeEditor
        id={defaultResponseEditorId}
        className='mt-2 max-h-80 w-full'
        value={defaultResponse ?? ""}
        onChange={setDefaultResponse}
      />
      <label htmlFor={floatingButtonOpacityId} className='mt-4 block'>
        Devtools Toggle Button Opacity
      </label>
      <input
        id={floatingButtonOpacityId}
        className='mt-2 w-1/2'
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
    </ScrollList>
  )
}
