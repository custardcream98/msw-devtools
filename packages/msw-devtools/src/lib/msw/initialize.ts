import type { SetupWorker, StartOptions } from "msw/browser"

import { StorageKey } from "~/constants"
import { getLocalStorageItem } from "~/hooks/useLocalStorageState"
import { autoFixJsonMock } from "~/utils/autoFixJsonMock"

import { register } from "./register"
import { getWorkerWithoutThrow, setWorker } from "./worker"

export type InitializeProps = {
  setupWorker: SetupWorker
  /**
   * @link https://mswjs.io/docs/api/setup-worker/start/#options
   */
  options?: StartOptions
}

export const initialize = async ({ setupWorker, options }: InitializeProps) => {
  if (getWorkerWithoutThrow()) {
    throw new Error("[MSW Devtools] Devtool already initialized")
  }

  setWorker(setupWorker)
  await setupWorker.start(options)

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
