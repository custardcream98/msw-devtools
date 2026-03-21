import { clsx } from "clsx"
import { type MethodOption } from "core"
import { useTranslation } from "react-i18next"
import { FaBolt, FaChevronRight, FaTriangleExclamation } from "react-icons/fa6"

import type { RequestLogEntry } from "~/components/contexts/request-log"
import { MethodPill } from "~/components/MethodPill"
import { UrlText } from "~/components/UrlText"
import { useBoolean } from "~/hooks/useBoolean"

import { LogDetail } from "./LogDetail"

/** Format timestamp as HH:MM:SS */
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":")
}

/** Status code text color */
const getStatusColor = (status?: number): string => {
  if (!status) return "text-slate-400"
  if (status >= 200 && status < 300) return "text-green-700"
  if (status >= 300 && status < 400) return "text-yellow-700"
  if (status >= 400) return "text-red-700"
  return "text-slate-600"
}

const getStatusBg = (status?: number): string => {
  if (!status) return ""
  if (status >= 200 && status < 300) return "bg-green-50"
  if (status >= 300 && status < 400) return "bg-yellow-50"
  if (status >= 400) return "bg-red-50"
  return ""
}

export const LogEntry = ({ entry }: { entry: RequestLogEntry }) => {
  const [isOpened, , , toggle] = useBoolean(false)
  const { t } = useTranslation()

  return (
    <div
      className={clsx(
        "rounded-md border border-slate-200 bg-white text-xs",
        !entry.matched && "border-l-2 border-l-yellow-400"
      )}
    >
      {/* Row header (clickable) */}
      <button
        type='button'
        className='flex w-full items-center gap-1.5 px-2 py-1.5 text-left'
        onClick={toggle}
      >
        {/* Accordion arrow */}
        <FaChevronRight
          size={8}
          className={clsx(
            "shrink-0 transform-gpu text-slate-400 transition-transform duration-200",
            isOpened && "rotate-90"
          )}
        />

        {/* Time */}
        <span className='shrink-0 font-mono text-[0.6rem] text-slate-400'>
          {formatTime(entry.timestamp)}
        </span>

        {/* Method */}
        <MethodPill method={entry.method as MethodOption} />

        {/* Status */}
        {entry.status != null && (
          <span
            className={clsx(
              "shrink-0 rounded px-1.5 py-0.5 font-mono text-[0.65rem] font-semibold",
              getStatusColor(entry.status),
              getStatusBg(entry.status)
            )}
          >
            {entry.status}
          </span>
        )}

        {/* URL */}
        <UrlText className='flex-1'>{entry.url}</UrlText>

        {/* Duration */}
        {entry.duration != null && (
          <span className='shrink-0 font-mono text-[0.6rem] text-slate-400'>
            {t("tabs.log.duration", { ms: Math.round(entry.duration) })}
          </span>
        )}

        {/* Matched/Unmatched icon */}
        {entry.matched ? (
          <FaBolt size={10} className='shrink-0 text-green-500' />
        ) : (
          <FaTriangleExclamation
            size={10}
            className='shrink-0 text-yellow-500'
          />
        )}
      </button>

      {/* Accordion detail */}
      <div
        className={clsx(
          "grid overflow-hidden transition-[grid-template-rows] duration-300",
          isOpened ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className='overflow-hidden'>
          {isOpened && <LogDetail entry={entry} />}
        </div>
      </div>
    </div>
  )
}
