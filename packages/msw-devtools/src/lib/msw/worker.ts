import type { SetupWorker } from "msw/browser"
import type { setupServer as setupServerNative } from "msw/native"
import type { SetupServerApi } from "msw/node"

type Worker =
  | SetupWorker
  | SetupServerApi
  | ReturnType<typeof setupServerNative>

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
}
