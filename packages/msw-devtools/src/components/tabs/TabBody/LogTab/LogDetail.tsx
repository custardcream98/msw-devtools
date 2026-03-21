import { BasicSetupOptions } from "@uiw/react-codemirror"
import { useTranslation } from "react-i18next"
import { FaPlus } from "react-icons/fa6"

import { CodeEditor } from "~/components/CodeEditor"
import type { RequestLogEntry } from "~/components/contexts/request-log"
import { useTab } from "~/components/tabs/TabBar/context"
import { Tab } from "~/constants"

const CODE_EDITOR_BASIC_SETUP_OPTIONS: BasicSetupOptions = {
  highlightActiveLine: false
}

const formatBody = (body: unknown): string => {
  if (body === undefined || body === null) return ""
  if (typeof body === "string") return body
  try {
    return JSON.stringify(body, null, 2)
  } catch {
    return String(body)
  }
}

export const LogDetail = ({ entry }: { entry: RequestLogEntry }) => {
  const { t } = useTranslation()
  const { setTab } = useTab()

  const hasRequestBody =
    entry.requestBody !== undefined && entry.requestBody !== null
  const hasResponseBody =
    entry.responseBody !== undefined && entry.responseBody !== null

  return (
    <div className='space-y-3 px-2 pb-3 pt-2'>
      {/* Request Body */}
      {hasRequestBody && (
        <div>
          <p className='mb-1 text-[0.65rem] font-semibold text-slate-500'>
            {t("tabs.log.requestBody")}
          </p>
          <CodeEditor
            value={formatBody(entry.requestBody)}
            basicSetup={CODE_EDITOR_BASIC_SETUP_OPTIONS}
            minHeight='auto'
            readOnly
          />
        </div>
      )}

      {/* Response Body */}
      {hasResponseBody && (
        <div>
          <p className='mb-1 text-[0.65rem] font-semibold text-slate-500'>
            {t("tabs.log.responseBody")}
          </p>
          <CodeEditor
            value={formatBody(entry.responseBody)}
            basicSetup={CODE_EDITOR_BASIC_SETUP_OPTIONS}
            minHeight='auto'
            readOnly
          />
        </div>
      )}

      {/* Unmatched request: Add Mock button */}
      {!entry.matched && (
        <button
          type='button'
          className='flex items-center gap-1.5 rounded bg-slate-700 px-3 py-1.5 text-[0.65rem] font-semibold text-white transition-colors hover:bg-slate-800'
          onClick={() => setTab(Tab.AddMock)}
        >
          <FaPlus size={10} />
          {t("tabs.log.addMockButton")}
        </button>
      )}

      {/* No body data available */}
      {!hasRequestBody && !hasResponseBody && entry.matched && (
        <p className='text-[0.65rem] text-slate-400'>
          {t("tabs.log.noBodyData")}
        </p>
      )}
    </div>
  )
}
