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
        className='w-10/12 rounded-lg bg-white p-5'
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
        <div className='flex w-full items-center'>
          <MethodPill className='mr-2' method={jsonMock.method} />
          <StatusPill className='mr-2' status={jsonMock.status} />
          <PromptModePill
            className='mr-2'
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
            "button ml-auto mt-4 block w-fit flex-shrink-0 bg-green-600 text-xs text-white hover:bg-green-600 hover:text-white disabled:pointer-events-none disabled:bg-slate-400"
          }
          disabled={!isParsable && !isFixable}
        >
          {isFixable ? t("prompt.fix") : t("prompt.submit")}
        </button>
      </form>
    </Backdrop>
  )
}
