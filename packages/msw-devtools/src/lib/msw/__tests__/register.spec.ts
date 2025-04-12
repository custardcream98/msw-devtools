import { FIELD_NAME } from "~/constants"
import { register, reset, unregister } from "~/lib/msw/register"
import { getWorker, type Worker } from "~/lib/msw/worker"

// Type definition for mocked handler to ensure type safety
interface MockedHandler {
  mock: any
  resolver: () => void
  _mockHandler: boolean
}

beforeEach(() => {
  vi.mock("~/lib/msw/worker")
  vi.mock("~/lib/msw/prompt", () => ({
    createPrompt: vi.fn()
  }))
  vi.mock("web-core", async (importOriginal) => ({
    ...(await importOriginal()),
    generateHandler: vi.fn((mock, resolver) => {
      // Return mock parameters with the handler for verification
      return { mock, resolver, _mockHandler: true } as MockedHandler
    })
  }))
})

describe("register", () => {
  it("should register mocks", () => {
    const useMock = vi.fn()
    const worker = {
      use: useMock
    } as unknown as Worker
    vi.mocked(getWorker).mockReturnValue(worker)

    const MOCK1 = { name: "mock1" } as any
    const MOCK2 = { name: "mock2" } as any
    register(MOCK1, MOCK2)

    // Verify function was called with correct arguments
    expect(useMock).toHaveBeenCalledOnce()

    // Safely retrieve call arguments
    const handler1 = useMock.mock.calls[0][0] as MockedHandler
    const handler2 = useMock.mock.calls[0][1] as MockedHandler

    // Verify each handler
    expect(handler1._mockHandler).toBe(true)
    expect(handler2._mockHandler).toBe(true)
    expect(handler1.mock).toBe(MOCK1)
    expect(handler2.mock).toBe(MOCK2)
    expect(typeof handler1.resolver).toBe("function")
    expect(typeof handler2.resolver).toBe("function")
  })
})

describe("unregister", () => {
  it("should unregister mocks", () => {
    const resetHandlersMock = vi.fn()
    const worker = {
      resetHandlers: resetHandlersMock
    } as unknown as Worker
    vi.mocked(getWorker).mockReturnValue(worker)

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

    // Basic verification
    expect(resetHandlersMock).toHaveBeenCalledOnce()
    expect(result).toEqual(NEXT_MOCKS)

    // Verify handlers
    const handler1 = resetHandlersMock.mock.calls[0][0] as MockedHandler
    const handler2 = resetHandlersMock.mock.calls[0][1] as MockedHandler

    expect(handler1._mockHandler).toBe(true)
    expect(handler2._mockHandler).toBe(true)
    expect(handler1.mock).toBe(MOCK1)
    expect(handler2.mock).toBe(MOCK3)
  })
})

describe("reset", () => {
  it("should reset all mocks", () => {
    const resetHandlersMock = vi.fn()
    const worker = {
      resetHandlers: resetHandlersMock
    } as unknown as Worker
    vi.mocked(getWorker).mockReturnValue(worker)

    reset()

    // Verify function call
    expect(resetHandlersMock).toHaveBeenCalledOnce()
    expect(resetHandlersMock.mock.calls[0].length).toBe(0)
  })

  it("should reset to specific mocks", () => {
    const resetHandlersMock = vi.fn()
    const worker = {
      resetHandlers: resetHandlersMock
    } as unknown as Worker
    vi.mocked(getWorker).mockReturnValue(worker)

    const MOCK1 = { name: "mock1" } as any
    const MOCK2 = { name: "mock2" } as any
    reset([MOCK1, MOCK2])

    // Verify function call
    expect(resetHandlersMock).toHaveBeenCalledOnce()

    // Verify handlers
    const handler1 = resetHandlersMock.mock.calls[0][0] as MockedHandler
    const handler2 = resetHandlersMock.mock.calls[0][1] as MockedHandler

    expect(handler1._mockHandler).toBe(true)
    expect(handler2._mockHandler).toBe(true)
    expect(handler1.mock).toBe(MOCK1)
    expect(handler2.mock).toBe(MOCK2)
  })
})
