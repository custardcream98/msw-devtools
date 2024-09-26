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
    throw new Error("[MSW Devtools] Devtool already initialized")
  }

  _api = setupWorker

  if ("start" in setupWorker) {
    await setupWorker.start(options)
  } else {
    setupWorker.listen(options)
  }

  const localStorageMocks = getLocalStorageItem<JsonMock[]>(MOCK_LIST)

  if (!localStorageMocks) {
    return
  }

  register(...localStorageMocks.filter((mock) => mock.isActivated))
}

export const getApi = () => {
  if (!_api) {
    throw new Error("[MSW Devtools] Devtool not initialized")
  }

  return _api
}

const generateMockRequestHandler = (mock: JsonMock) => {
  return http[mock[FIELD_NAME.METHOD]](mock[FIELD_NAME.URL], async () => {
    if (mock[FIELD_NAME.RESPONSE_DELAY] > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, mock[FIELD_NAME.RESPONSE_DELAY] * 1000)
      )
    }

    return HttpResponse.json(mock[FIELD_NAME.RESPONSE])
  })
}

export const register = (...mocks: JsonMock[]) => {
  const api = getApi()

  api.use(...mocks.map(generateMockRequestHandler))
}

export const unregister = (
  currentMocks: JsonMock[],
  ...mocksToUnregister: JsonMock[]
) => {
  const api = getApi()

  const nextLocalStorageMocks = currentMocks.filter((mockItem) =>
    mocksToUnregister.every(
      (mockToUnregister) => !isSameMockJson(mockItem, mockToUnregister)
    )
  )

  api.resetHandlers(...nextLocalStorageMocks.map(generateMockRequestHandler))

  return nextLocalStorageMocks
}

export const MOCK_LIST = "MOCK_LIST" as const
