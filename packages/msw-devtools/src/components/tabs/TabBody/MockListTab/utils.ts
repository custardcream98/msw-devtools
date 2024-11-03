import { isJsonMocks, type JsonMock } from "core"
import { jsonrepair } from "jsonrepair"

import { autoFixJsonMock } from "~/utils/autoFixJsonMock"

const dispatchClickEvent = (element: HTMLElement) => {
  const event = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true
  })
  element.dispatchEvent(event)
}

export const saveJson = (data: object, filename: string) => {
  const file = new Blob([JSON.stringify(data, null, 2)], {
    type: "text/json"
  })
  const a = document.createElement("a")

  a.download = filename
  a.href = URL.createObjectURL(file)
  a.dataset.downloadurl = ["text/json", a.download, a.href].join(":")

  dispatchClickEvent(a)

  URL.revokeObjectURL(a.href)
  a.remove()
}

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject

    reader.readAsText(file)
  })
}

const validateMocks = (data: unknown): JsonMock[] => {
  const resolvedData = Array.isArray(data)
    ? data.map(autoFixJsonMock)
    : [autoFixJsonMock(data)]

  if (!isJsonMocks(resolvedData)) throw new Error("Invalid JSON structure")

  return resolvedData
}

export const loadJson = ({
  onLoad
}: {
  onLoad: (mocks: JsonMock[]) => void
}) => {
  const input = document.createElement("input")
  input.type = "file"
  input.accept = ".json"
  input.onchange = async (e) => {
    const file = (e.currentTarget as HTMLInputElement).files?.[0]

    if (file) {
      try {
        const content = await readFileAsText(file)

        const data = JSON.parse(jsonrepair(content)) as unknown

        onLoad(validateMocks(data))
      } catch {
        alert("[MSW Devtools] Invalid JSON file")
      }
    }

    input.remove()
  }

  dispatchClickEvent(input)
}
