import { isJsonMocks, type JsonMock } from "core"
import { jsonrepair } from "jsonrepair"

import { autoFixJsonMock } from "~/utils/autoFixJsonMock"

export const dispatchClickEvent = (element: HTMLElement) => {
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

export const loadJson = ({
  onLoad
}: {
  onLoad: (mocks: JsonMock[]) => void
}) => {
  const input = document.createElement("input")
  input.type = "file"
  input.accept = ".json"
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(
            jsonrepair(e.target?.result as string)
          ) as unknown

          const resolvedData = Array.isArray(data)
            ? data.map(autoFixJsonMock)
            : [autoFixJsonMock(data)]

          if (!isJsonMocks(resolvedData)) {
            throw new Error()
          }

          onLoad(resolvedData)
        } catch (error) {
          alert("[MSW Devtools] Invalid JSON file")
        }
      }

      reader.readAsText(file)
    }

    input.remove()
  }

  dispatchClickEvent(input)
}
