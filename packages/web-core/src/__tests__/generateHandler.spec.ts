import { JsonMock } from "core"
import { setupServer } from "msw/node"

import { generateHandler } from "../generateHandler"

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("generateHandler", () => {
  it("should return a request handler", async () => {
    const mock = {
      method: "get",
      url: "https://test-url.com",
      responseDelay: 0,
      response: {
        type: "single",
        response: { name: "John" }
      },
      status: "200",
      isActivated: true,
      shouldPromptResponse: false
    } as const satisfies JsonMock

    const requestHandler = generateHandler(mock)

    server.use(requestHandler)

    const res = await fetch("https://test-url.com")
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data).toEqual({ name: "John" })
  })

  it("should handle sequential responses", async () => {
    const mock = {
      method: "get",
      url: "https://test-sequential.com",
      responseDelay: 0,
      response: {
        type: "sequential",
        response: [{ name: "John" }, { name: "Doe" }]
      },
      status: "200",
      isActivated: true,
      shouldPromptResponse: false
    } as const satisfies JsonMock

    const requestHandler = generateHandler(mock)

    server.use(requestHandler)

    const firstRes = await fetch("https://test-sequential.com")
    const firstData = await firstRes.json()
    expect(firstRes.status).toBe(200)
    expect(firstData).toEqual({ name: "John" })

    const secondRes = await fetch("https://test-sequential.com")
    const secondData = await secondRes.json()
    expect(secondRes.status).toBe(200)
    expect(secondData).toEqual({ name: "Doe" })

    const thirdRes = await fetch("https://test-sequential.com")
    const thirdData = await thirdRes.json()
    expect(thirdRes.status).toBe(200)
    expect(thirdData).toEqual({ name: "John" })
  })

  it("should handle delayed responses", async () => {
    vi.useFakeTimers()

    const mock = {
      responseDelay: 5,
      method: "get",
      url: "https://test-delay.com",
      response: {
        type: "single",
        response: { name: "Delayed John" }
      },
      status: "200",
      isActivated: true,
      shouldPromptResponse: false
    } as const satisfies JsonMock

    const requestHandler = generateHandler(mock)
    server.use(requestHandler)

    const fetchPromise = fetch("https://test-delay.com")
    await vi.advanceTimersByTimeAsync(5000)
    const res = await fetchPromise
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual({ name: "Delayed John" })

    vi.useRealTimers()
  })

  it("should prompt user for response", async () => {
    const mock = {
      responseDelay: 0,
      method: "get",
      url: "https://test-delay.com",
      response: {
        type: "single",
        response: { name: "Delayed John" }
      },
      status: "200",
      isActivated: true,
      shouldPromptResponse: true
    } as const satisfies JsonMock
    const promptResponse = vi.fn(() => Promise.resolve("Delayed John"))

    const requestHandler = generateHandler(mock, promptResponse)
    server.use(requestHandler)

    const res = await fetch("https://test-delay.com")
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data).toEqual("Delayed John")
    expect(promptResponse).toHaveBeenCalledOnce()
  })
})
