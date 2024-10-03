import type { JsonMock } from "@custardcream/msw-devtools-core"
import { setupServer } from "msw/node"

import { generateHandler } from "~/lib/msw/generateHandler"

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("generateMockRequestHandler", () => {
  it("should return a request handler", async () => {
    const mock = {
      method: "get",
      url: "/test-url",
      responseDelay: 0,
      response: {
        type: "single",
        response: { name: "John" }
      },
      status: "200",
      isActivated: true
    } as const satisfies JsonMock

    const requestHandler = generateHandler(mock)
    expect(requestHandler).toBeDefined()

    server.use(requestHandler)

    const res = await fetch("/test-url")
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data).toEqual({ name: "John" })
  })

  it("should handle sequential responses", async () => {
    const mock = {
      method: "get",
      url: "/test-sequential",
      responseDelay: 0,
      response: {
        type: "sequential",
        response: [{ name: "John" }, { name: "Doe" }]
      },
      status: "200",
      isActivated: true
    } as const satisfies JsonMock

    const requestHandler = generateHandler(mock)

    server.use(requestHandler)

    const firstRes = await fetch("/test-sequential")
    const firstData = await firstRes.json()
    expect(firstRes.status).toBe(200)
    expect(firstData).toEqual({ name: "John" })

    const secondRes = await fetch("/test-sequential")
    const secondData = await secondRes.json()
    expect(secondRes.status).toBe(200)
    expect(secondData).toEqual({ name: "Doe" })

    const thirdRes = await fetch("/test-sequential")
    const thirdData = await thirdRes.json()
    expect(thirdRes.status).toBe(200)
    expect(thirdData).toEqual({ name: "John" })
  })

  it("should handle delayed responses", async () => {
    vi.useFakeTimers()

    const mock = {
      responseDelay: 5,
      method: "get",
      url: "/test-delay",
      response: {
        type: "single",
        response: { name: "Delayed John" }
      },
      status: "200",
      isActivated: true
    } as const

    const requestHandler = generateHandler(mock)
    server.use(requestHandler)

    const fetchPromise = fetch("/test-delay")
    await vi.advanceTimersByTimeAsync(5000)
    const res = await fetchPromise
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual({ name: "Delayed John" })

    vi.useRealTimers()
  }, 10000)
})
