import type { JsonMock } from "@custardcream/msw-devtools-core"
import type { SharedOptions } from "msw"
import type { SetupWorker, StartOptions } from "msw/browser"
import type { setupServer as setupServerNative } from "msw/native"
import type { SetupServerApi } from "msw/node"

import { StorageKey } from "~/constants"
import {
  getLocalStorageItem,
  setLocalStorageItem
} from "~/hooks/useLocalStorageState"
import { register } from "~/lib/msw/register"

import { getWorkerWithoutThrow, setWorker } from "./worker"

export type InitializeProps =
  | {
      setupWorker: SetupWorker
      /**
       * @link https://mswjs.io/docs/api/setup-worker/start/#options
       */
      options?: StartOptions
    }
  | {
      setupWorker: SetupServerApi | ReturnType<typeof setupServerNative>
      /**
       * @link https://mswjs.io/docs/api/setup-server/listen/#options
       */
      options?: Partial<SharedOptions>
    }
export const initialize = async ({ setupWorker, options }: InitializeProps) => {
  if (getWorkerWithoutThrow()) {
    throw new Error("[MSW Devtools] Devtool already initialized")
  }

  setWorker(setupWorker)

  if ("start" in setupWorker) {
    await setupWorker.start(options)
  } else {
    setupWorker.listen(options)
  }

  const localStorageMocks = backwardsCompatibleMocks(
    getLocalStorageItem(StorageKey.MOCK_LIST)
  )

  if (!localStorageMocks) {
    return
  }

  register(...localStorageMocks.filter((mock) => mock.isActivated))

  return localStorageMocks
}

// TODO: delete on 1.0.0 release
const backwardsCompatibleMocks = (mocks?: JsonMock[]) => {
  if (!mocks) {
    return
  }

  const newMocks = mocks.map((mock) => {
    if (typeof mock.response === "string") {
      return {
        ...mock,
        response: {
          type: "single",
          response: mock.response
        }
      } satisfies JsonMock
    }

    return mock
  })

  setLocalStorageItem(StorageKey.MOCK_LIST, newMocks)

  return newMocks
}
