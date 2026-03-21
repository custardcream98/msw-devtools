import type { SetupWorker } from "msw/browser"
import type { setupServer as setupServerNative } from "msw/native"

export type Worker = SetupWorker | ReturnType<typeof setupServerNative>

let _worker: Worker

export const getWorker = () => {
  if (!_worker) {
    throw new Error("[MSW Devtools] Devtool not initialized")
  }

  return _worker
}

export const getWorkerWithoutThrow = () => {
  return _worker
}

export const setWorker = (worker: Worker) => {
  _worker = worker
  startEarlyCapture(worker)
}

// ---------------------------------------------------------------------------
// Early capture: buffer MSW events from worker start so that requests
// occurring before RequestLogProvider mounts are not lost.
// ---------------------------------------------------------------------------

export type EarlyEvent =
  | { type: "start"; requestId: string; timestamp: number }
  | { type: "match"; requestId: string; request: Request; timestamp: number }
  | {
      type: "unhandled"
      requestId: string
      request: Request
      timestamp: number
    }
  | {
      type: "response"
      requestId: string
      response: Response
      timestamp: number
    }
  | { type: "end"; requestId: string }

let _earlyBuffer: EarlyEvent[] = []
let _cleanupEarlyCapture: (() => void) | null = null

function startEarlyCapture(worker: Worker) {
  _earlyBuffer = []

  const onStart = ({ requestId }: { request: Request; requestId: string }) => {
    _earlyBuffer.push({
      type: "start",
      requestId,
      timestamp: performance.now()
    })
  }
  const onMatch = ({
    request,
    requestId
  }: {
    request: Request
    requestId: string
  }) => {
    _earlyBuffer.push({
      type: "match",
      requestId,
      request: request.clone(),
      timestamp: Date.now()
    })
  }
  const onUnhandled = ({
    request,
    requestId
  }: {
    request: Request
    requestId: string
  }) => {
    _earlyBuffer.push({
      type: "unhandled",
      requestId,
      request: request.clone(),
      timestamp: Date.now()
    })
  }
  const onResponse = ({
    response,
    requestId
  }: {
    response: Response
    request: Request
    requestId: string
  }) => {
    _earlyBuffer.push({
      type: "response",
      requestId,
      response: response.clone(),
      timestamp: performance.now()
    })
  }
  const onEnd = ({ requestId }: { request: Request; requestId: string }) => {
    _earlyBuffer.push({ type: "end", requestId })
  }

  worker.events.on("request:start", onStart)
  worker.events.on("request:match", onMatch)
  worker.events.on("request:unhandled", onUnhandled)
  worker.events.on("response:mocked", onResponse)
  worker.events.on("request:end", onEnd)

  _cleanupEarlyCapture = () => {
    worker.events.removeListener("request:start", onStart)
    worker.events.removeListener("request:match", onMatch)
    worker.events.removeListener("request:unhandled", onUnhandled)
    worker.events.removeListener("response:mocked", onResponse)
    worker.events.removeListener("request:end", onEnd)
  }
}

/** Called when RequestLogProvider mounts — returns buffered events and removes early listeners */
export function drainEarlyBuffer(): EarlyEvent[] {
  _cleanupEarlyCapture?.()
  _cleanupEarlyCapture = null
  const buffer = _earlyBuffer
  _earlyBuffer = []
  return buffer
}
