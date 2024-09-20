import { ScrollList } from "~/components/ScrollList"
import { useSettings } from "~/components/TabBody/SettingsTab/context"

export const SettingsTab = () => {
  const { defaultResponse, setDefaultResponse } = useSettings()

  return (
    <ScrollList>
      <header>
        <h2>Set Default Response Body</h2>
        <span>
          {
            "TIP: When editing response body, you can automatically move the cursor when using the $ (dollar sign) in default values. When the cursor is focused on a $, pressing Tab will move it to the next dollar sign."
          }
        </span>
      </header>
      <form
        onSubmit={(event) => {
          event.preventDefault()

          const formData = new FormData(event.currentTarget)
          const defaultResponseBody = formData.get("defaultResponseBody")

          if (typeof defaultResponseBody === "string") {
            setDefaultResponse(defaultResponseBody)
          }
        }}
      >
        <textarea
          defaultValue={defaultResponse ?? ""}
          required
          name='defaultResponseBody'
          className='msw-d-textarea msw-d-mt-2 msw-d-h-32 msw-d-w-full'
        ></textarea>
        <button className='msw-d-button-lg msw-d-mt-2 msw-d-w-full msw-d-bg-blue-500 msw-d-text-white hover:msw-d-bg-blue-700 hover:msw-d-text-white disabled:msw-d-bg-slate-400'>
          Save
        </button>
      </form>
    </ScrollList>
  )
}
