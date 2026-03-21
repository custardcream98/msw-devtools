import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Tab } from "~/constants"
import { drainEarlyBuffer, getWorkerWithoutThrow } from "~/lib/msw/worker"

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
// Constants
// ---------------------------------------------------------------------------

/** Max log entries (FIFO) */
const MAX_LOG_SIZE = 200

/** Skip static assets, HMR, and browser-internal requests */
const IGNORED_EXTENSIONS =
  /\.(js|mjs|cjs|ts|tsx|jsx|css|less|scss|map|svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot|json)(\?|$)/i
const IGNORED_PATHS = /\/@(vite|fs|id)\//

function shouldCaptureRequest(url: string): boolean {
  try {
    const { pathname } = new URL(url)
    if (IGNORED_EXTENSIONS.test(pathname)) return false
    if (IGNORED_PATHS.test(pathname)) return false
    return true
  } catch {
    return true
  }
}

// Tab.Log constant reference
const TAB_LOG = Tab.Log

// ---------------------------------------------------------------------------
// Context + Hook
// ---------------------------------------------------------------------------

const RequestLogContext = React.createContext<RequestLogContextType | null>(
  null
)

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
// Helper: safely parse request/response body
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

  // Stable refs for accessing latest values inside event handlers
  const isRecordingRef = useRef(isRecording)
  isRecordingRef.current = isRecording

  // Track current tab (increment unreadCount when not on Log tab)
  const { tab } = useTab()
  const tabRef = useRef(tab)
  tabRef.current = tab

  // Map for tracking request:start timestamps
  const startTimesRef = useRef(new Map<string, number>())

  // ---- FIFO append helper ----
  const appendLog = useCallback((entry: RequestLogEntry) => {
    setLogs((prev) => {
      const next = [...prev, entry]
      return next.length > MAX_LOG_SIZE ? next.slice(-MAX_LOG_SIZE) : next
    })
    // Increment unread when not on Log tab
    if (tabRef.current !== TAB_LOG) {
      setUnreadCount((c) => c + 1)
    }
  }, [])

  // ---- Log entry update helper (response:mocked / async body parsing) ----
  const updateLog = useCallback(
    (
      requestId: string,
      patch: Partial<
        Pick<
          RequestLogEntry,
          "status" | "duration" | "responseBody" | "requestBody"
        >
      >
    ) => {
      setLogs((prev) =>
        prev.map((entry) =>
          entry.id === requestId ? { ...entry, ...patch } : entry
        )
      )
    },
    []
  )

  // ---- Drain early buffer on mount (captures requests before Provider mounted) ----
  useEffect(() => {
    const buffer = drainEarlyBuffer()
    if (buffer.length === 0) return

    const startTimes = new Map<string, number>()
    for (const event of buffer) {
      switch (event.type) {
        case "start":
          startTimes.set(event.requestId, event.timestamp)
          break
        case "match":
          if (!shouldCaptureRequest(event.request.url)) break
          appendLog({
            id: event.requestId,
            timestamp: event.timestamp,
            method: event.request.method,
            url: event.request.url,
            matched: true,
            duration: startTimes.get(event.requestId)
              ? performance.now() - startTimes.get(event.requestId)!
              : undefined
          })
          safeParseBody(event.request).then((requestBody) => {
            if (requestBody !== undefined)
              updateLog(event.requestId, { requestBody })
          })
          break
        case "unhandled":
          if (!shouldCaptureRequest(event.request.url)) break
          appendLog({
            id: event.requestId,
            timestamp: event.timestamp,
            method: event.request.method,
            url: event.request.url,
            matched: false,
            duration: startTimes.get(event.requestId)
              ? performance.now() - startTimes.get(event.requestId)!
              : undefined
          })
          safeParseBody(event.request).then((requestBody) => {
            if (requestBody !== undefined)
              updateLog(event.requestId, { requestBody })
          })
          break
        case "response":
          safeParseBody(event.response).then((responseBody) => {
            updateLog(event.requestId, {
              status: event.response.status,
              duration: startTimes.get(event.requestId)
                ? performance.now() - startTimes.get(event.requestId)!
                : undefined,
              responseBody
            })
          })
          startTimes.delete(event.requestId)
          break
        case "end":
          startTimes.delete(event.requestId)
          break
      }
    }
  }, [appendLog, updateLog])

  // ---- MSW event subscription ----
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
      if (!shouldCaptureRequest(request.url)) return

      const startTime = startTimesRef.current.get(requestId)

      // Create entry synchronously so response:mocked can find it
      appendLog({
        id: requestId,
        timestamp: Date.now(),
        method: request.method,
        url: request.url,
        matched: true,
        duration: startTime ? performance.now() - startTime : undefined
      })

      // Parse body async and patch later
      safeParseBody(request).then((requestBody) => {
        if (requestBody !== undefined) {
          updateLog(requestId, { requestBody })
        }
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
      if (!shouldCaptureRequest(request.url)) return

      const startTime = startTimesRef.current.get(requestId)

      appendLog({
        id: requestId,
        timestamp: Date.now(),
        method: request.method,
        url: request.url,
        matched: false,
        duration: startTime ? performance.now() - startTime : undefined
      })

      safeParseBody(request).then((requestBody) => {
        if (requestBody !== undefined) {
          updateLog(requestId, { requestBody })
        }
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

      // Clean up start timestamp
      startTimesRef.current.delete(requestId)
    }

    const handleRequestEnd = ({
      requestId
    }: {
      request: Request
      requestId: string
    }) => {
      // Clean up startTimes (in case response:mocked didn't fire)
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

  // ---- Memoized context value ----
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
