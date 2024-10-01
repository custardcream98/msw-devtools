import { setupServer } from "msw/node"

import { FIELD_NAME } from "~/constants"
import { generateHandler } from "~/lib/msw/generateHandler"
import type { JsonMock } from "~/types"

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("generateMockRequestHandler", () => {
  it("should return a request handler", async () => {
    const mock = {
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.URL]: "/test-url",
      [FIELD_NAME.RESPONSE_DELAY]: 0,
      [FIELD_NAME.RESPONSE]: {
        type: "single",
        response: { name: "John" }
      },
      [FIELD_NAME.STATUS]: "200",
      isActivated: true
    } as const

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
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.URL]: "/test-sequential",
      [FIELD_NAME.RESPONSE_DELAY]: 0,
      [FIELD_NAME.RESPONSE]: {
        type: "sequential",
        response: [{ name: "John" }, { name: "Doe" }]
      },
      [FIELD_NAME.STATUS]: "200",
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
      [FIELD_NAME.RESPONSE_DELAY]: 5,
      [FIELD_NAME.METHOD]: "get",
      [FIELD_NAME.URL]: "/test-delay",
      [FIELD_NAME.RESPONSE]: {
        type: "single",
        response: { name: "Delayed John" }
      },
      [FIELD_NAME.STATUS]: "200",
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
