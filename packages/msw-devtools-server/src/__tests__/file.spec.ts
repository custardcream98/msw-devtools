import chokidar from "chokidar"
import fs from "fs"
import type { Mock } from "vitest"

import { readMockListFile, updateMockListFile, watchMockListFile } from "~/file"
import { log } from "~/utils/log"
import { parseJsonMockList } from "~/utils/parseJsonMockList"

const mockListJsonPath = "path/to/mockList.json"
const MOCKED_JSON_LIST_STRING = '[{"key": "value"}]'
const MOCKED_JSON_LIST = [{ key: "value" }]

vi.mock("fs")
vi.mock("chokidar")
vi.mock("~/utils/log", () => ({
  log: {
    error: vi.fn()
  }
}))

vi.mock("~/utils/parseJsonMockList", () => ({
  parseJsonMockList: vi.fn()
}))

describe("readMockListFile", () => {
  it("should read and parse the mock list file successfully", () => {
    ;(parseJsonMockList as Mock).mockReturnValue(MOCKED_JSON_LIST)

    const result = readMockListFile(mockListJsonPath)

    expect(result).toEqual(MOCKED_JSON_LIST)
  })

  it("should return null if an readFile error occurs", () => {
    ;(fs.readFileSync as Mock).mockImplementation(() => {
      throw new Error("File not found")
    })

    const result = readMockListFile(mockListJsonPath)

    expect(result).toBeNull()
  })

  it("should return null if an parse error occurs", () => {
    ;(parseJsonMockList as Mock).mockImplementation(() => {
      throw new Error("Cannot parse JSON")
    })

    const result = readMockListFile(mockListJsonPath)

    expect(result).toBeNull()
  })
})

describe("updateMockListFile", () => {
  it("should write the mock list to the file", async () => {
    const mockList = [{ key: "value" }] as any
    const updateFile = updateMockListFile(mockListJsonPath)

    updateFile(mockList)

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockListJsonPath,
      JSON.stringify(mockList, null, 2)
    )
  })
})

describe("watchMockListFile", () => {
  const setup = () => {
    const watcherMock = {
      on: vi.fn(),
      off: vi.fn(),
      close: vi.fn()
    }
    const callback = vi.fn()

    ;(chokidar.watch as Mock).mockReturnValue(watcherMock)

    return { watcherMock, callback }
  }

  it("should start watching the mock list file for changes", () => {
    const { watcherMock, callback } = setup()

    watchMockListFile(mockListJsonPath, callback)

    expect(chokidar.watch).toHaveBeenCalledWith(mockListJsonPath, {
      ignored: expect.any(Function)
    })
    expect(watcherMock.on).toHaveBeenCalledWith("change", expect.any(Function))
  })

  it("should call the callback with parsed mock list on file change", () => {
    const { watcherMock, callback } = setup()
    ;(fs.readFileSync as Mock).mockReturnValue(MOCKED_JSON_LIST_STRING)
    ;(parseJsonMockList as Mock).mockReturnValue(MOCKED_JSON_LIST)

    watchMockListFile(mockListJsonPath, callback)

    const changeHandler = watcherMock.on.mock.calls.find(
      ([event]) => event === "change"
    )?.[1]
    changeHandler()

    expect(callback).toHaveBeenCalledWith(MOCKED_JSON_LIST)
    expect(callback).toHaveBeenCalledOnce()
  })

  it("should log an error if reading or parsing fails", () => {
    const { watcherMock, callback } = setup()
    ;(fs.readFileSync as Mock).mockImplementation(() => {
      throw new Error("Read error")
    })

    watchMockListFile(mockListJsonPath, callback)

    const changeHandler = watcherMock.on.mock.calls.find(
      ([event]) => event === "change"
    )?.[1]
    changeHandler()

    expect(log.error).toHaveBeenCalledWith(
      `Failed to parse the mock list from ${mockListJsonPath}`
    )
    expect(callback).not.toHaveBeenCalledOnce()
  })

  it("should stop watching when the returned function is called", () => {
    const { watcherMock, callback } = setup()

    const closeWatcher = watchMockListFile(mockListJsonPath, callback)
    const changeHandler = watcherMock.on.mock.calls.find(
      ([event]) => event === "change"
    )?.[1]
    closeWatcher()

    expect(watcherMock.off).toHaveBeenCalledWith("change", changeHandler)
    expect(watcherMock.close).toHaveBeenCalled()
  })
})
