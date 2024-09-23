import { http, HttpResponse, SharedOptions } from "msw"
import { type SetupWorker, StartOptions } from "msw/browser"
import { type setupServer as setupServerNative } from "msw/native"
import { type SetupServerApi } from "msw/node"

import { FIELD_NAME } from "~/constants"
import {
  getLocalStorageItem,
  setLocalStorageItem
} from "~/hooks/useLocalStorageState"
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

  const localStorageMocks = getLocalStorageItem<JsonMock[]>(ACTIVATED_MOCK_LIST)

  if (!localStorageMocks) {
    return
  }

  localStorageMocks.forEach((mock) => {
    activateMock(mock)
  })
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

export const deactivateMock = (mock: JsonMock) => {
  const api = getApi()

  const localStorageMocks = getLocalStorageItem<JsonMock[]>(ACTIVATED_MOCK_LIST)

  if (!localStorageMocks) {
    return
  }

  const nextLocalStorageMocks = localStorageMocks.filter(
    (mockItem) => mock[FIELD_NAME.URL] !== mockItem[FIELD_NAME.URL]
  )

  const nextHandlers = nextLocalStorageMocks.map((mockItem) =>
    http[mockItem[FIELD_NAME.METHOD]](mockItem[FIELD_NAME.URL], () =>
      HttpResponse.json(mockItem[FIELD_NAME.RESPONSE])
    )
  )

  api.resetHandlers(...nextHandlers)

  setLocalStorageItem(ACTIVATED_MOCK_LIST, nextLocalStorageMocks)
}

export const ACTIVATED_MOCK_LIST = "ACTIVATED_MOCK_LIST"
