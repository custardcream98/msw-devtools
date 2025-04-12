import { isSameJsonMock, type JsonMock } from "core"
import { generateHandler } from "web-core"

import { Prompt } from "~/components/Prompt"
import { createPrompt } from "~/lib/msw/prompt"
import { getWorker } from "~/lib/msw/worker"

const renderPrompt = (props: React.ComponentProps<typeof Prompt>) => (
  <Prompt {...props} />
)

const generateHandlerWithPrompt = (jsonMock: JsonMock) =>
  generateHandler(jsonMock, () => createPrompt(jsonMock, renderPrompt))

export const register = (...mocks: JsonMock[]) => {
  const worker = getWorker()

  worker.use(...mocks.map(generateHandlerWithPrompt))
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

  worker.resetHandlers(...nextLocalStorageMocks.map(generateHandlerWithPrompt))

  return nextLocalStorageMocks
}

export const reset = (mocks?: JsonMock[]) => {
  const worker = getWorker()

  worker.resetHandlers(...(mocks?.map(generateHandlerWithPrompt) || []))
}
