import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Tab } from "~/constants"
import { getWorkerWithoutThrow } from "~/lib/msw/worker"

import { useTab } from "../tabs/TabBar/context"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RequestLogEntry = {
  id: string
  timestamp: number
  method: string
  url: string
  status?: number
  duration?: number
  matched: boolean
  requestBody?: unknown
  responseBody?: unknown
  mockType?: "sequential" | "prompt" | null
}

export type RequestLogContextType = {
  logs: RequestLogEntry[]
  isRecording: boolean
  setIsRecording: (value: boolean) => void
  clearLogs: () => void
  unreadCount: number
  resetUnreadCount: () => void
}

// ---------------------------------------------------------------------------
// 상수
// ---------------------------------------------------------------------------

/** FIFO 최대 로그 수 */
const MAX_LOG_SIZE = 200

// Tab.Log 상수 참조
const TAB_LOG = Tab.Log

// ---------------------------------------------------------------------------
// Context + Hook
// ---------------------------------------------------------------------------

const RequestLogContext =
  React.createContext<RequestLogContextType | null>(null)

export const useRequestLog = () => {
  const context = React.useContext(RequestLogContext)
  if (!context) {
    throw new Error(
      "[MSW Devtools] useRequestLog must be used within a RequestLogProvider"
    )
  }
  return context
}

// ---------------------------------------------------------------------------
// Helper: request body를 안전하게 파싱
// ---------------------------------------------------------------------------

async function safeParseBody(
  source: Request | Response
): Promise<unknown | undefined> {
  try {
    const cloned = source.clone()
    const text = await cloned.text()
    if (!text) return undefined
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  } catch {
    return undefined
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const RequestLogProvider = ({ children }: React.PropsWithChildren) => {
  const [logs, setLogs] = useState<RequestLogEntry[]>([])
  const [isRecording, setIsRecording] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  // useRef로 안정 참조 — 이벤트 핸들러 내에서 최신 값 접근
  const isRecordingRef = useRef(isRecording)
  isRecordingRef.current = isRecording

  // 현재 탭 확인 (Log 탭이 아니면 unreadCount 증가)
  const { tab } = useTab()
  const tabRef = useRef(tab)
  tabRef.current = tab

  // request:start 시각 기록용 Map
  const startTimesRef = useRef(new Map<string, number>())

  // ---- FIFO append 헬퍼 ----
  const appendLog = useCallback((entry: RequestLogEntry) => {
    setLogs((prev) => {
      const next = [...prev, entry]
      return next.length > MAX_LOG_SIZE ? next.slice(-MAX_LOG_SIZE) : next
    })
    // 현재 탭이 Log가 아니면 unread 증가
    if (tabRef.current !== TAB_LOG) {
      setUnreadCount((c) => c + 1)
    }
  }, [])

  // ---- 로그 항목 업데이트 헬퍼 (response:mocked / response:bypass) ----
  const updateLog = useCallback(
    (
      requestId: string,
      patch: Partial<Pick<RequestLogEntry, "status" | "duration" | "responseBody">>
    ) => {
      setLogs((prev) =>
        prev.map((entry) =>
          entry.id === requestId ? { ...entry, ...patch } : entry
        )
      )
    },
    []
  )

  // ---- MSW 이벤트 구독 ----
  useEffect(() => {
    const worker = getWorkerWithoutThrow()
    if (!worker) return

    const handleRequestStart = ({
      requestId
    }: {
      request: Request
      requestId: string
    }) => {
      startTimesRef.current.set(requestId, performance.now())
    }

    const handleRequestMatch = ({
      request,
      requestId
    }: {
      request: Request
      requestId: string
    }) => {
      if (!isRecordingRef.current) return

      const startTime = startTimesRef.current.get(requestId)

      // body 비동기 파싱 후 로그 추가
      safeParseBody(request).then((requestBody) => {
        appendLog({
          id: requestId,
          timestamp: Date.now(),
          method: request.method,
          url: request.url,
          matched: true,
          requestBody,
          duration: startTime ? performance.now() - startTime : undefined
        })
      })
    }

    const handleRequestUnhandled = ({
      request,
      requestId
    }: {
      request: Request
      requestId: string
    }) => {
      if (!isRecordingRef.current) return

      const startTime = startTimesRef.current.get(requestId)

      safeParseBody(request).then((requestBody) => {
        appendLog({
          id: requestId,
          timestamp: Date.now(),
          method: request.method,
          url: request.url,
          matched: false,
          requestBody,
          duration: startTime ? performance.now() - startTime : undefined
        })
      })
    }

    const handleResponseMocked = ({
      response,
      requestId
    }: {
      response: Response
      request: Request
      requestId: string
    }) => {
      if (!isRecordingRef.current) return

      const startTime = startTimesRef.current.get(requestId)
      const duration = startTime ? performance.now() - startTime : undefined

      safeParseBody(response).then((responseBody) => {
        updateLog(requestId, {
          status: response.status,
          duration,
          responseBody
        })
      })

      // 타임스탬프 정리
      startTimesRef.current.delete(requestId)
    }

    const handleRequestEnd = ({ requestId }: { request: Request; requestId: string }) => {
      // startTimes 메모리 정리 (response:mocked에서 이미 삭제되지 않은 경우)
      startTimesRef.current.delete(requestId)
    }

    worker.events.on("request:start", handleRequestStart)
    worker.events.on("request:match", handleRequestMatch)
    worker.events.on("request:unhandled", handleRequestUnhandled)
    worker.events.on("response:mocked", handleResponseMocked)
    worker.events.on("request:end", handleRequestEnd)

    return () => {
      worker.events.removeListener("request:start", handleRequestStart)
      worker.events.removeListener("request:match", handleRequestMatch)
      worker.events.removeListener("request:unhandled", handleRequestUnhandled)
      worker.events.removeListener("response:mocked", handleResponseMocked)
      worker.events.removeListener("request:end", handleRequestEnd)
    }
  }, [appendLog, updateLog])

  // ---- clearLogs / resetUnreadCount ----
  const clearLogs = useCallback(() => {
    setLogs([])
    setUnreadCount(0)
  }, [])

  const resetUnreadCount = useCallback(() => {
    setUnreadCount(0)
  }, [])

  // ---- context value 메모이제이션 ----
  const value = useMemo<RequestLogContextType>(
    () => ({
      logs,
      isRecording,
      setIsRecording,
      clearLogs,
      unreadCount,
      resetUnreadCount
    }),
    [logs, isRecording, clearLogs, unreadCount, resetUnreadCount]
  )

  return <RequestLogContext value={value}>{children}</RequestLogContext>
}
