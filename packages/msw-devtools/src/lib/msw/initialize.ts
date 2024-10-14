import type { SharedOptions } from "msw"
import type { SetupWorker, StartOptions } from "msw/browser"
import type { setupServer as setupServerNative } from "msw/native"
import type { SetupServerApi } from "msw/node"

import { StorageKey } from "~/constants"
import { getLocalStorageItem } from "~/hooks/useLocalStorageState"
import { autoFixJsonMock } from "~/utils/autoFixJsonMock"

import { register } from "./register"
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

  const localStorageMocks = getLocalStorageItem(StorageKey.MOCK_LIST)
    ?.map(autoFixJsonMock)
    .filter(isDefined)

  if (!localStorageMocks) {
    return
  }

  register(...localStorageMocks.filter((mock) => mock.isActivated))

  return localStorageMocks
}

const isDefined = <T>(value: T | null | undefined): value is NonNullable<T> => {
  return value !== null && value !== undefined
}
