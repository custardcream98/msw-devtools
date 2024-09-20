import { http, HttpResponse } from "msw"
import { FaFileExport, FaFileImport } from "react-icons/fa6"

import { ScrollList } from "~/components/ScrollList"
import {
  FIELD_NAME,
  FormFieldValues
} from "~/components/TabBody/AddMockTab/AddMockForm/form"
import { getApi } from "~/lib/msw"

import { useActivatedMockList } from "./context"

const saveJson = (data: object, filename: string) => {
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

export const ActivatedMockListTab = () => {
  const { activatedMockList, addActivatedMock } = useActivatedMockList()

  return (
    <div className='msw-d-flex msw-d-h-full'>
      <div className='msw-d-flex msw-d-h-full msw-d-flex-col msw-d-gap-2 msw-d-border-r msw-d-border-solid msw-d-border-slate-200 msw-d-p-2'>
        <button
          title='Export Mocks'
          type='button'
          className='msw-d-button-icon hover:msw-d-bg-slate-300 hover:msw-d-text-slate-600'
          onClick={() => {
            saveJson(
              activatedMockList.map(
                ({ [FIELD_NAME.RESPONSE]: response, ...data }) => ({
                  ...data,
                  [FIELD_NAME.RESPONSE]: JSON.parse(response)
                })
              ),
              "mocks.json"
            )
          }}
        >
          <FaFileExport />
        </button>
        <button
          title='Import Mocks'
          type='button'
          className='msw-d-button-icon hover:msw-d-bg-slate-300 hover:msw-d-text-slate-600'
          onClick={() => {
            const input = document.createElement("input")
            input.type = "file"
            input.accept = ".json"
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0]

              if (file) {
                const reader = new FileReader()
                reader.onload = (e) => {
                  const data = JSON.parse(e.target?.result as string)

                  data.forEach(
                    (
                      mock: Omit<
                        FormFieldValues,
                        typeof FIELD_NAME.RESPONSE
                      > & {
                        [FIELD_NAME.RESPONSE]: object
                      }
                    ) => {
                      const api = getApi()

                      try {
                        api.use(
                          http[mock[FIELD_NAME.METHOD]](
                            mock[FIELD_NAME.URL],
                            () => {
                              return HttpResponse.json(
                                mock[FIELD_NAME.RESPONSE]
                              )
                            }
                          )
                        )

                        addActivatedMock({
                          ...mock,
                          [FIELD_NAME.RESPONSE]: JSON.stringify(
                            mock[FIELD_NAME.RESPONSE]
                          )
                        })
                      } catch (error) {
                        console.error(error)
                      }
                    }
                  )
                }

                reader.readAsText(file)
              }

              input.remove()
            }

            input.click()
          }}
        >
          <FaFileImport />
        </button>
      </div>
      <ScrollList className='msw-d-w-full'>
        <ul className='msw-d-w-full [&>li+li]:msw-d-mt-4'>
          {activatedMockList.map((mock) => (
            <li
              key={mock[FIELD_NAME.URL]}
              className='msw-d-flex msw-d-rounded-2xl msw-d-bg-white msw-d-p-4 msw-d-shadow-xl'
            >
              <div className='msw-d-w-full'>
                <p className='msw-d-uppercase'>{mock[FIELD_NAME.METHOD]}</p>
                <p>{mock[FIELD_NAME.URL]}</p>
              </div>
              <pre className='msw-d-w-full'>
                {JSON.stringify(JSON.parse(mock[FIELD_NAME.RESPONSE]), null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      </ScrollList>
    </div>
  )
}
