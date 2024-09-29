import type { SetupWorker } from "msw/browser"
import type { SetupServerApi } from "msw/node"

import { getWorker, getWorkerWithoutThrow, setWorker } from "~/lib/msw"

const mockWorkerBrowser = {} as SetupWorker
const mockWorkerNode = {} as SetupServerApi

beforeEach(() => {
  setWorker(undefined as any)
})

describe("getWorker", () => {
  it("throws an error if worker is not initialized", () => {
    expect(() => getWorker()).toThrowError(
      "[MSW Devtools] Devtool not initialized"
    )
  })

  it("returns the worker if it is set", () => {
    setWorker(mockWorkerBrowser)
    expect(getWorker()).toBe(mockWorkerBrowser)
  })
})

describe("getWorkerWithoutThrow", () => {
  it("returns undefined if worker is not initialized", () => {
    expect(getWorkerWithoutThrow()).toBeUndefined()
  })

  it("returns the worker if it is set", () => {
    setWorker(mockWorkerNode)
    expect(getWorkerWithoutThrow()).toBe(mockWorkerNode)
  })
})

describe("setWorker", () => {
  it("sets the worker properly", () => {
    setWorker(mockWorkerBrowser)
    expect(getWorker()).toBe(mockWorkerBrowser)

    setWorker(mockWorkerNode)
    expect(getWorker()).toBe(mockWorkerNode)
  })
})
