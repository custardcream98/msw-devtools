import { colorLog, logger } from "../logger"

describe("colorLog", () => {
  it("should return a client log format with color", () => {
    const result = colorLog("client", "blue", "Test message")
    expect(result).toEqual(["%cTest message", "color: blue"])
  })

  it("should return a server log format with red color", () => {
    const result = colorLog("server", "red", "Test message")
    expect(result).toEqual(["\x1b[31m Test message\x1b[0m"])
  })

  it("should return a server log format with blue color", () => {
    const result = colorLog("server", "blue", "Test message")
    expect(result).toEqual(["\x1b[34m Test message\x1b[0m"])
  })
})

describe("logger", () => {
  it("should log info message for client", () => {
    console.log = vi.fn() // Mock console.log
    const log = logger("client")
    log.info("Client info message")
    expect(console.log).toHaveBeenCalledWith(
      "%c[MSW DevTools] Client info message",
      "color: blue"
    )
  })

  it("should log error message for client", () => {
    console.error = vi.fn()
    const log = logger("client")
    log.error("Client error message")
    expect(console.error).toHaveBeenCalledWith(
      "%c[MSW DevTools] Client error message",
      "color: red"
    )
  })

  it("should log info message for server", () => {
    console.log = vi.fn()
    const log = logger("server")
    log.info("Server info message")
    expect(console.log).toHaveBeenCalledWith(
      "\x1b[34m [MSW DevTools Server] Server info message\x1b[0m"
    )
  })

  it("should log error message for server", () => {
    console.error = vi.fn()
    const log = logger("server")
    log.error("Server error message")
    expect(console.error).toHaveBeenCalledWith(
      "\x1b[31m [MSW DevTools Server] Server error message\x1b[0m"
    )
  })
})
