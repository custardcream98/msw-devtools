import { http, HttpResponse } from "msw"

import { FIELD_NAME } from "~/components/tabs/TabBody/AddMockTab/AddMockForm"
import { getApi } from "~/lib/msw"
import { JsonMock } from "~/types"

const isJsonMocks = (data: unknown): data is JsonMock[] => {
  return Array.isArray(data) && data.every(isJsonMock)
}

export const saveJson = (data: object, filename: string) => {
  const file = new Blob([JSON.stringify(data, null, 2)], {
    type: "text/json"
  })
  const a = document.createElement("a")

  a.download = filename
  a.href = URL.createObjectURL(file)
  a.dataset.downloadurl = ["text/json", a.download, a.href].join(":")

  const event = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true
  })

  a.dispatchEvent(event)

  URL.revokeObjectURL(a.href)
  a.remove()
}

const isJsonMock = (data: unknown): data is JsonMock => {
  return (
    typeof data === "object" &&
    data !== null &&
    FIELD_NAME.URL in data &&
    FIELD_NAME.METHOD in data &&
    FIELD_NAME.STATUS in data &&
    FIELD_NAME.RESPONSE in data &&
    typeof data[FIELD_NAME.URL] === "string" &&
    typeof data[FIELD_NAME.METHOD] === "string" &&
    typeof data[FIELD_NAME.STATUS] === "string" &&
    typeof data[FIELD_NAME.RESPONSE] === "object"
  )
}

export const loadJson = ({
  onLoad
}: {
  onLoad: (activatedMocks: JsonMock[]) => void
}) => {
  const input = document.createElement("input")
  input.type = "file"
  input.accept = ".json"
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = JSON.parse(e.target?.result as string)

        if (!isJsonMocks(data)) {
          throw new Error("Invalid Mock format")
        }

        data.forEach((mock) => {
          const api = getApi()
          api.use(
            http[mock[FIELD_NAME.METHOD]](mock[FIELD_NAME.URL], () => {
              return HttpResponse.json(mock[FIELD_NAME.RESPONSE])
            })
          )
        })

        onLoad(data)
      }

      reader.readAsText(file)
    }

    input.remove()
  }

  input.click()
}
