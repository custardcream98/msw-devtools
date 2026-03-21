import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { useRequestLog } from "~/components/contexts/request-log"

import { type LogFilter, LogControls } from "./LogControls"
import { LogEntry } from "./LogEntry"

export const LogTab = () => {
  const { logs, isRecording, setIsRecording, clearLogs, resetUnreadCount } =
    useRequestLog()
  const { t } = useTranslation()

  const [filter, setFilter] = useState<LogFilter>("all")
  const listRef = useRef<HTMLDivElement>(null)

  // Log 탭 진입 시 unreadCount 리셋
  useEffect(() => {
    resetUnreadCount()
  }, [resetUnreadCount])

  // 필터링된 로그
  const filteredLogs = useMemo(() => {
    if (filter === "all") return logs
    if (filter === "matched") return logs.filter((l) => l.matched)
    return logs.filter((l) => !l.matched)
  }, [logs, filter])

  // 새 로그 추가 시 자동 스크롤
  const prevLengthRef = useRef(filteredLogs.length)
  useEffect(() => {
    if (filteredLogs.length > prevLengthRef.current) {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
    prevLengthRef.current = filteredLogs.length
  }, [filteredLogs.length])

  return (
    <div className='flex h-full flex-col'>
      <LogControls
        isRecording={isRecording}
        onToggleRecording={() => setIsRecording(!isRecording)}
        onClear={clearLogs}
        filter={filter}
        onFilterChange={setFilter}
      />

      {filteredLogs.length === 0 ? (
        <div className='flex flex-1 items-center justify-center text-sm text-slate-400'>
          {t("tabs.log.noLogs")}
        </div>
      ) : (
        <div ref={listRef} className='flex-1 overflow-auto p-3'>
          <ul className='w-full space-y-1.5'>
            {filteredLogs.map((entry) => (
              <li key={entry.id}>
                <LogEntry entry={entry} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
