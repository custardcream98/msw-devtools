// Storybook용 MSW mock 모듈
// 실제 MSW worker 없이 동작할 수 있도록 stub 함수 제공

export const register = (..._mocks: unknown[]) => {}
export const unregister = (
  currentMocks: unknown[],
  _mocksToUnregister: unknown[]
) => currentMocks
export const reset = (_mocks?: unknown[]) => {}
export const getWorker = () => ({
  use: () => {},
  resetHandlers: () => {}
})
export const setWorker = () => {}
export const getWorkerWithoutThrow = () => undefined
export const initializeWorker = () => Promise.resolve()
