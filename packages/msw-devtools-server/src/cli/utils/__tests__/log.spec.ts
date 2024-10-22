import * as core from "core"

describe("log", () => {
  it('should initialize a logger with the "server" namespace', async () => {
    vi.spyOn(core, "logger")
    await import("~/cli/utils/log")

    expect(core.logger).toHaveBeenCalledOnce()
    expect(core.logger).toHaveBeenCalledWith("server")
  })
})
