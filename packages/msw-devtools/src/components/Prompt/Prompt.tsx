import { type JsonMock } from "core"
import { jsonrepair } from "jsonrepair"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { CodeEditor } from "~/components/CodeEditor"
import { MethodPill } from "~/components/MethodPill"
import { PromptModePill } from "~/components/PromptModePill"
import { StatusPill } from "~/components/StatusPill"
import { UrlText } from "~/components/UrlText"
import { checkJSONParsable, isJSONFixable } from "~/lib/json"

import { Backdrop } from "./Backdrop"

export const Prompt = ({
  jsonMock,
  onSubmit
}: {
  jsonMock: JsonMock
  onSubmit: (response: string) => void
}) => {
  const [response, setResponse] = useState(
    jsonMock.response.type === "single"
      ? JSON.stringify(jsonMock.response.response, null, 2)
      : JSON.stringify(jsonMock.response.response[0], null, 2)
  )
  const isFixable = isJSONFixable(response)
  const isParsable = checkJSONParsable(response)

  const { t } = useTranslation()

  return (
    <Backdrop>
      <form
        className='w-10/12 max-w-2xl rounded-md border border-slate-200 bg-white p-5 shadow-lg'
        onSubmit={(event) => {
          event.preventDefault()

          if (isFixable) {
            setResponse(jsonrepair(response))
            return
          }
          if (response) {
            onSubmit(JSON.parse(response))
          }
        }}
      >
        <div className='flex w-full items-center gap-1.5'>
          <MethodPill method={jsonMock.method} />
          <StatusPill status={jsonMock.status} />
          <PromptModePill
            isPromptModeActivated={jsonMock.shouldPromptResponse}
          />
          <UrlText>{jsonMock.url}</UrlText>
        </div>
        <CodeEditor
          className='mt-4 w-full'
          value={response}
          onChange={setResponse}
          autoFocus
        />
        <button
          type='submit'
          className={
            "button ml-auto mt-3 block w-fit shrink-0 bg-blue-600 text-xs text-white hover:bg-blue-700 hover:text-white disabled:pointer-events-none disabled:bg-slate-300 disabled:text-slate-400"
          }
          disabled={!isParsable && !isFixable}
        >
          {isFixable ? t("prompt.fix") : t("prompt.submit")}
        </button>
      </form>
    </Backdrop>
  )
}
