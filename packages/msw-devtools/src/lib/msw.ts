import { http, HttpResponse, SharedOptions } from "msw"
import { type SetupWorker, StartOptions } from "msw/browser"
import { type setupServer as setupServerNative } from "msw/native"
import { type SetupServerApi } from "msw/node"

import { FIELD_NAME } from "~/constants"
import { JsonMock } from "~/types"

type Api = SetupWorker | SetupServerApi | ReturnType<typeof setupServerNative>
let _api: Api

export type InitializeProps =
  | {
      setupWorker: SetupWorker
      options?: StartOptions
    }
  | {
      setupWorker: SetupServerApi | ReturnType<typeof setupServerNative>
      options?: Partial<SharedOptions>
    }
export const initialize = async ({ setupWorker, options }: InitializeProps) => {
  if (_api) {
    throw new Error("[MSW] Devtool already initialized")
  }

  _api = setupWorker

  if ("start" in setupWorker) {
    await setupWorker.start(options)
  } else {
    setupWorker.listen(options)
  }

  const rawLocalStorageMocks = localStorage.getItem(
    MSW_DEVTOOLS_ACTIVATED_MOCK_LIST
  )

  if (!rawLocalStorageMocks) {
    return
  }

  try {
    const localStorageMocks = JSON.parse(rawLocalStorageMocks) as JsonMock[]

    localStorageMocks.forEach((mock) => {
      activateMock(mock)
    })
  } catch (error) {
    console.error(error)
  }
}

export const getApi = () => {
  if (!_api) {
    throw new Error("[MSW] Devtool not initialized")
  }

  return _api
}

export const activateMock = (mock: JsonMock) => {
  const api = getApi()

  api.use(
    http[mock[FIELD_NAME.METHOD]](mock[FIELD_NAME.URL], () => {
      return HttpResponse.json(mock[FIELD_NAME.RESPONSE])
    })
  )
}

export const MSW_DEVTOOLS_ACTIVATED_MOCK_LIST =
  "MSW_DEVTOOLS_ACTIVATED_MOCK_LIST"
