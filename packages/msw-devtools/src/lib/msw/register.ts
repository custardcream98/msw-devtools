import { generateHandler, type JsonMock } from "core"

import { getWorker } from "~/lib/msw/worker"
import { isSameJsonMock } from "~/utils/isSameJsonMock"

export const register = (...mocks: JsonMock[]) => {
  const worker = getWorker()

  worker.use(...mocks.map(generateHandler))
}

export const unregister = (
  currentMocks: JsonMock[],
  mocksToUnregister: JsonMock[]
) => {
  const worker = getWorker()

  const nextLocalStorageMocks = currentMocks.filter((mockItem) =>
    mocksToUnregister.every(
      (mockToUnregister) => !isSameJsonMock(mockItem, mockToUnregister)
    )
  )

  worker.resetHandlers(...nextLocalStorageMocks.map(generateHandler))

  return nextLocalStorageMocks
}

export const reset = (mocks?: JsonMock[]) => {
  const worker = getWorker()

  worker.resetHandlers(...(mocks?.map(generateHandler) || []))
}
