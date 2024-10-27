import chokidar from "chokidar"
import { JsonMock } from "core"
import fs from "fs"
import path from "path"

import {
  readMockListFile,
  readMockListFileRecursive,
  updateMockListFile,
  watchMockListFile
} from "~/cli/utils/file"
import { log } from "~/cli/utils/log"
import { parseJsonMockList } from "~/cli/utils/parseJsonMockList"

const MOCKED_JSON_LIST_PATH = "path/to/mock-list.json"
const MOCKED_JSON_LIST_STRING = '[{"key": "value"}]'
const MOCKED_JSON_LIST = [{ key: "value" }] as unknown as JsonMock[]

vi.mock("fs")
vi.mock("chokidar")
vi.mock("~/cli/utils/log", () => ({
  log: {
    error: vi.fn()
  }
}))
vi.mock("~/cli/program", () => ({
  options: {
    output: "path/to/mock-list.json"
  }
}))

vi.mock("~/cli/utils/parseJsonMockList", () => ({
  parseJsonMockList: vi.fn()
}))

describe("readMockListFile", () => {
  it("should read and parse the mock list file successfully", () => {
    vi.mocked(parseJsonMockList).mockReturnValue(MOCKED_JSON_LIST)

    const result = readMockListFile()

    expect(result).toEqual(MOCKED_JSON_LIST)
  })

  it("should return null if an readFile error occurs", () => {
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error("File not found")
    })

    const result = readMockListFile()

    expect(result).toBeNull()
  })

  it("should return null if an parse error occurs", () => {
    vi.mocked(parseJsonMockList).mockImplementation(() => {
      throw new Error("Cannot parse JSON")
    })

    const result = readMockListFile()

    expect(result).toBeNull()
  })
})

describe("readMockListFileRecursive", () => {
  it("should read and parse the mock list file recursively", () => {
    vi.mocked(fs.readdirSync).mockReturnValue([
      "file.json"
    ] as unknown as ReturnType<typeof fs.readdirSync>)
    vi.mocked(fs.statSync).mockReturnValue({
      isDirectory: () => false,
      isFile: () => true
    } as unknown as ReturnType<typeof fs.statSync>)
    vi.mocked(fs.readFileSync).mockReturnValue(MOCKED_JSON_LIST_STRING)
    vi.mocked(parseJsonMockList).mockReturnValue(MOCKED_JSON_LIST)

    const result = readMockListFileRecursive()

    expect(result).toEqual(MOCKED_JSON_LIST)
  })

  it("should return an empty array if the directory is empty", () => {
    vi.mocked(fs.readdirSync).mockReturnValue([])

    const result = readMockListFileRecursive()

    expect(result).toEqual([])
  })
})

describe("updateMockListFileRecursive", () => {
  it("should update the mock list file recursively", () => {
    // TODO: Implement the test
  })
})

describe("updateMockListFile", () => {
  it("should write the mock list to the file", async () => {
    const mockList = [{ key: "value" }] as any

    updateMockListFile(mockList)

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      MOCKED_JSON_LIST_PATH,
      JSON.stringify(mockList, null, 2),
      {
        encoding: "utf-8"
      }
    )
  })

  it("should try to make directory if it does not exists", async () => {
    const mockList = [{ key: "value" }] as any
    vi.mocked(fs.existsSync).mockImplementation(() => false)

    updateMockListFile(mockList)

    expect(fs.mkdirSync).toHaveBeenCalledWith(
      path.dirname(MOCKED_JSON_LIST_PATH),
      { recursive: true }
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

    vi.mocked(chokidar.watch).mockReturnValue(
      watcherMock as unknown as ReturnType<typeof chokidar.watch>
    )

    return { watcherMock, callback }
  }

  it("should start watching the mock list file for changes", () => {
    const { watcherMock, callback } = setup()

    watchMockListFile(callback)

    expect(chokidar.watch).toHaveBeenCalledWith(MOCKED_JSON_LIST_PATH, {
      ignored: expect.any(Function)
    })
    expect(watcherMock.on).toHaveBeenCalledWith("change", expect.any(Function))
  })

  it("should call the callback with parsed mock list on file change", () => {
    const { watcherMock, callback } = setup()
    vi.mocked(fs.readFileSync).mockReturnValue(MOCKED_JSON_LIST_STRING)
    vi.mocked(parseJsonMockList).mockReturnValue(MOCKED_JSON_LIST)

    watchMockListFile(callback)

    const changeHandler = watcherMock.on.mock.calls.find(
      ([event]) => event === "change"
    )?.[1]
    changeHandler()

    expect(callback).toHaveBeenCalledWith(MOCKED_JSON_LIST)
    expect(callback).toHaveBeenCalledOnce()
  })

  it("should log an error if reading or parsing fails", () => {
    const { watcherMock, callback } = setup()
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error("Read error")
    })

    watchMockListFile(callback)

    const changeHandler = watcherMock.on.mock.calls.find(
      ([event]) => event === "change"
    )?.[1]
    changeHandler()

    expect(log.error).toHaveBeenCalledWith(
      `Failed to parse the mock list from ${MOCKED_JSON_LIST_PATH}`
    )
    expect(callback).not.toHaveBeenCalledOnce()
  })

  it("should stop watching when the returned function is called", () => {
    const { watcherMock, callback } = setup()

    const closeWatcher = watchMockListFile(callback)
    const changeHandler = watcherMock.on.mock.calls.find(
      ([event]) => event === "change"
    )?.[1]
    closeWatcher()

    expect(watcherMock.off).toHaveBeenCalledWith("change", changeHandler)
    expect(watcherMock.close).toHaveBeenCalled()
  })
})

describe("watchMockListFileRecursive", () => {
  it("should start watching the mock list file recursively for changes", () => {
    // TODO: Implement the test
  })
})
