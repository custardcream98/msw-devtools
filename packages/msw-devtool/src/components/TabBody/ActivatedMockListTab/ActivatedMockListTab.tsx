import { FaFileExport, FaFileImport } from "react-icons/fa6"

import { ScrollList } from "~/components/ScrollList"
import { FIELD_NAME } from "~/components/TabBody/AddMockTab/AddMockForm/form"

import { useActivatedMockList } from "./context"
import { loadJson, saveJson } from "./utils"

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
            saveJson(activatedMockList, "mocks.json")
          }}
        >
          <FaFileExport />
        </button>
        <button
          title='Import Mocks'
          type='button'
          className='msw-d-button-icon hover:msw-d-bg-slate-300 hover:msw-d-text-slate-600'
          onClick={() => {
            loadJson({
              onLoad: (loadedMocks) => {
                loadedMocks.forEach(addActivatedMock)
              }
            })
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
                {JSON.stringify(mock[FIELD_NAME.RESPONSE], null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      </ScrollList>
    </div>
  )
}
