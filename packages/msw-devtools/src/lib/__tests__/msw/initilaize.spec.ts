import { Mock } from "vitest"

import { getLocalStorageItem } from "~/hooks/useLocalStorageState"
import { setWorker } from "~/lib/msw"
import { register } from "~/lib/msw/register"

beforeEach(() => {
  vi.mock("~/hooks/useLocalStorageState")
  vi.mock("~/lib/msw/register")
})

afterEach(() => {
  vi.resetModules()
})

describe("initialize", () => {
  it("should throw an error if devtool is already initialized", async () => {
    setWorker({} as any)
    const { initialize } = await import("~/lib/msw/initialize")

    expect(() => initialize({ setupWorker: {} as any })).rejects.toThrowError(
      "[MSW Devtools] Devtool already initialized"
    )
  })

  it("should set the worker and start it if it's a browser worker", async () => {
    const start = vi.fn()
    const setupWorker = {
      start
    } as any
    const OPTIONS = "OPTIONS" as any
    const { initialize } = await import("~/lib/msw/initialize")

    await initialize({ setupWorker, options: OPTIONS })

    expect(start).toHaveBeenCalledWith(OPTIONS)
  })

  it("should set the worker and listen if it's a node worker", async () => {
    const listen = vi.fn()
    const setupWorker = {
      listen
    } as any
    const OPTIONS = "OPTIONS" as any

    const { initialize } = await import("~/lib/msw/initialize")

    await initialize({ setupWorker, options: OPTIONS })

    expect(listen).toHaveBeenCalledWith(OPTIONS)
  })

  it("should not register any mocks if there are no mocks in the local storage", async () => {
    const { initialize } = await import("~/lib/msw/initialize")

    await initialize({ setupWorker: { start: () => {} } as any })

    expect(register).not.toHaveBeenCalled()
  })

  it("should register mocks if there are mocks in the local storage", async () => {
    const MOCK_LOCAL_STORAGE = [{ isActivated: true, name: "mock1" }]

    ;(getLocalStorageItem as Mock).mockReturnValue(MOCK_LOCAL_STORAGE)
    const { initialize } = await import("~/lib/msw/initialize")

    await initialize({ setupWorker: { start: () => {} } as any })

    expect(register).toHaveBeenCalledWith(...MOCK_LOCAL_STORAGE)
  })
})