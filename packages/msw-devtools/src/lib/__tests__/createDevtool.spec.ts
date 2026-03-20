import type { Root } from "react-dom/client"

import { startServer } from "~/lib/server"

vi.mock("~/lib/server", () => ({
  startServer: vi.fn()
}))

// React 19의 스케줄러가 환경 teardown 후 window에 접근하지 않도록 root를 추적해서 unmount
let reactRoot: Root | null = null
vi.mock("react-dom/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom/client")>()
  return {
    ...actual,
    default: {
      ...actual,
      createRoot: (...args: Parameters<typeof actual.createRoot>) => {
        const root = actual.createRoot(...args)
        reactRoot = root
        return root
      }
    }
  }
})

afterEach(async () => {
  if (reactRoot) {
    reactRoot.unmount()
    reactRoot = null
    // flush microtasks
    await new Promise((r) => setTimeout(r, 0))
  }
  vi.resetModules()
  document.body.innerHTML = ""
})

describe("createDevtool", () => {
  it("should render DevTools", async () => {
    const { createDevtool } = await import("~/lib/createDevtool")

    await createDevtool({ setupWorker: { start: () => {} } as any })

    const containers = document.querySelectorAll("#msw-devtools")

    expect(containers).toHaveLength(1)
  })

  it("should reuse existing container if already in the DOM", async () => {
    const { createDevtool } = await import("~/lib/createDevtool")

    const existingContainer = document.createElement("div")
    existingContainer.id = "msw-devtools"
    document.body.appendChild(existingContainer)
    await createDevtool({ setupWorker: { start: () => {} } as any })
    const containers = document.querySelectorAll("#msw-devtools")

    expect(containers.length).toBe(1)
  })

  it("should initialize server connection if isUsingServer is true", async () => {
    const { createDevtool } = await import("~/lib/createDevtool")
    const mockServer = vi.fn()

    vi.mocked(startServer).mockImplementation(mockServer)

    await createDevtool({
      setupWorker: { start: () => {} } as any,
      isUsingServer: true
    })

    expect(mockServer).toHaveBeenCalledOnce()
  })

  it("should not initialize server connection if isUsingServer is false", async () => {
    const { createDevtool } = await import("~/lib/createDevtool")
    const mockServer = vi.fn()

    vi.mocked(startServer).mockImplementation(mockServer)

    await createDevtool({
      setupWorker: { start: () => {} } as any,
      isUsingServer: false
    })

    expect(mockServer).not.toHaveBeenCalled()
  })
})
