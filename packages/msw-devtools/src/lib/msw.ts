import { http, HttpResponse, SharedOptions } from "msw"
import { type SetupWorker, StartOptions } from "msw/browser"
import { type setupServer as setupServerNative } from "msw/native"
import { type SetupServerApi } from "msw/node"

import { FIELD_NAME } from "~/constants"
import { getLocalStorageItem } from "~/hooks/useLocalStorageState"
import { JsonMock } from "~/types"
import { isSameMockJson } from "~/utils/isSameMockJson"

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

  register(...localStorageMocks)
}

export const getApi = () => {
  if (!_api) {
    throw new Error("[MSW] Devtool not initialized")
  }

  return _api
}

export const register = (...mocks: JsonMock[]) => {
  const api = getApi()

  api.use(
    ...mocks.map((mock) =>
      http[mock[FIELD_NAME.METHOD]](mock[FIELD_NAME.URL], async () => {
        if (mock[FIELD_NAME.RESPONSE_DELAY] > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, mock[FIELD_NAME.RESPONSE_DELAY] * 1000)
          )
        }

        return HttpResponse.json(mock[FIELD_NAME.RESPONSE])
      })
    )
  )
}

export const unregister = (...mocks: JsonMock[]) => {
  const api = getApi()

  const localStorageMocks = getLocalStorageItem<JsonMock[]>(ACTIVATED_MOCK_LIST)

  if (!localStorageMocks) {
    return
  }

  const nextLocalStorageMocks = localStorageMocks.filter((mockItem) =>
    mocks.every((mock) => !isSameMockJson(mockItem, mock))
  )

  const nextHandlers = nextLocalStorageMocks.map((mockItem) =>
    http[mockItem[FIELD_NAME.METHOD]](mockItem[FIELD_NAME.URL], () =>
      HttpResponse.json(mockItem[FIELD_NAME.RESPONSE])
    )
  )

  api.resetHandlers(...nextHandlers)

  return nextHandlers
}

export const ACTIVATED_MOCK_LIST = "ACTIVATED_MOCK_LIST"
