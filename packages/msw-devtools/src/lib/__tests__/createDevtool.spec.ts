import { Mock } from "vitest"

import { server } from "~/lib/server"
import { viteHmr } from "~/lib/vite"

vi.mock("~/lib/server", () => ({
  server: vi.fn()
}))
vi.mock("~/lib/vite", () => ({
  viteHmr: vi.fn()
}))

afterEach(() => {
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

  it("should initialize server connection", async () => {
    const { createDevtool } = await import("~/lib/createDevtool")
    const mockServer = vi.fn()
    const mockViteHmr = vi.fn()

    ;(server as Mock).mockImplementation(mockServer)
    ;(viteHmr as Mock).mockImplementation(mockViteHmr)

    await createDevtool({ setupWorker: { start: () => {} } as any })

    expect(mockServer).toHaveBeenCalledOnce()
    expect(mockViteHmr).toHaveBeenCalledOnce()
  })
})
