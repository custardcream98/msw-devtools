import type { SharedOptions } from "msw"
import type { SetupWorker, StartOptions } from "msw/browser"
import type { setupServer as setupServerNative } from "msw/native"
import type { SetupServerApi } from "msw/node"

import { StorageKey } from "~/constants"
import { getLocalStorageItem } from "~/hooks/useLocalStorageState"
import { register } from "~/lib/msw/register"

import { getWorkerWithoutThrow, setWorker } from "./worker"

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

  if (!localStorageMocks) {
    return
  }

  register(...localStorageMocks.filter((mock) => mock.isActivated))
}
