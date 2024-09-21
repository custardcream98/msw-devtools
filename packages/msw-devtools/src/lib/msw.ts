import { SharedOptions } from "msw"
import { type SetupWorker, StartOptions } from "msw/browser"
import { type setupServer as setupServerNative } from "msw/native"
import { type SetupServerApi } from "msw/node"

type Api = SetupWorker | SetupServerApi | ReturnType<typeof setupServerNative>
let _api: Api

export type InitializeProps =
  | {
      api: SetupWorker
      options?: StartOptions
    }
  | {
      api: SetupServerApi | ReturnType<typeof setupServerNative>
      options?: Partial<SharedOptions>
    }
export const initialize = async ({ api, options }: InitializeProps) => {
  if (_api) {
    throw new Error("[MSW] Devtool already initialized")
  }

  _api = api

  if ("start" in api) {
    await api.start(options)
  } else {
    api.listen(options)
  }
}

export const getApi = () => {
  if (!_api) {
    throw new Error("[MSW] Devtool not initialized")
  }

  return _api
}
