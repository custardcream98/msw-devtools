import { SharedOptions } from "msw"
import { type SetupWorker, StartOptions } from "msw/browser"
import { type setupServer as setupServerNative } from "msw/native"
import { type SetupServerApi } from "msw/node"

type Api = SetupWorker | SetupServerApi | ReturnType<typeof setupServerNative>
let _api: Api

type SetupStatus = {
  isStarted: boolean
  startPromise: Promise<ServiceWorkerRegistration | undefined> | null
}
const _setupStatus: SetupStatus = {
  isStarted: false,
  startPromise: null
}

export type InitializeProps =
  | {
      api: SetupWorker
      options?: StartOptions
    }
  | {
      api: SetupServerApi | ReturnType<typeof setupServerNative>
      options?: Partial<SharedOptions>
    }
export const initialize = ({ api, options }: InitializeProps) => {
  _api = api

  if ("start" in api) {
    _setupStatus.startPromise = api.start(options)
  } else {
    _setupStatus.isStarted = true
    api.listen(options)
  }
}

export const getApi = () => {
  if (!_api) {
    throw new Error("[MSW] Devtool not initialized")
  }

  return _api
}

const _getSetupStatus = () => {
  if (!_setupStatus.isStarted && !_setupStatus.startPromise) {
    throw new Error("[MSW] Devtool not initialized")
  }

  return _setupStatus
}

export const waitForApi = async () => {
  const setupStatus = _getSetupStatus()

  if (setupStatus.isStarted) {
    return
  }

  await setupStatus.startPromise

  setupStatus.isStarted = true
}
