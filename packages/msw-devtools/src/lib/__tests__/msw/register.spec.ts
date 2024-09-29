import { Mock } from "vitest"

import { FIELD_NAME } from "~/constants"
import { register, unregister } from "~/lib/msw/register"
import { getWorker } from "~/lib/msw/worker"

beforeEach(() => {
  vi.mock("~/lib/msw/worker")
  vi.mock("~/lib/msw/generateHandler")
})

describe("register", () => {
  it("should register mocks", () => {
    const worker = {
      use: vi.fn()
    }
    ;(getWorker as Mock).mockReturnValue(worker)
    vi.mock("~/lib/msw/generateHandler", () => ({
      generateHandler: (...args: any) => args
    }))

    const MOCK1 = { name: "mock1" } as any
    const MOCK2 = { name: "mock2" } as any
    register(MOCK1, MOCK2)

    expect(worker.use).toHaveBeenCalledWith(
      [MOCK1, 0, [MOCK1, MOCK2]],
      [MOCK2, 1, [MOCK1, MOCK2]]
    )
  })
})

describe("unregister", () => {
  it("should unregister mocks", () => {
    const worker = {
      resetHandlers: vi.fn()
    }
    ;(getWorker as Mock).mockReturnValue(worker)
    vi.mock("~/lib/msw/generateHandler", () => ({
      generateHandler: (...args: any) => args
    }))

    const MOCK1 = {
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.URL]: "mock1"
    } as any
    const MOCK2 = {
      [FIELD_NAME.METHOD]: "post",
      [FIELD_NAME.URL]: "mock2"
    } as any
    const MOCK3 = {
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.URL]: "mock3"
    } as any
    const MOCK4 = {
      [FIELD_NAME.METHOD]: "post",
      [FIELD_NAME.URL]: "mock4"
    } as any
    const MOCKS = [MOCK1, MOCK2, MOCK3, MOCK4]
    const MOCKS_TO_UNREGISTER = [MOCK2, MOCK4]
    const NEXT_MOCKS = [MOCK1, MOCK3]

    const result = unregister(MOCKS, MOCKS_TO_UNREGISTER)

    expect(worker.resetHandlers).toHaveBeenCalledWith(
      [MOCK1, 0, NEXT_MOCKS],
      [MOCK3, 1, NEXT_MOCKS]
    )
    expect(result).toEqual(NEXT_MOCKS)
  })
})
