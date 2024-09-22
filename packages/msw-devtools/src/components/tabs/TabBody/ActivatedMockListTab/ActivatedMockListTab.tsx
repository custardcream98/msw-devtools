import { FaFileExport, FaFileImport } from "react-icons/fa6"

import { ScrollList } from "~/components/ScrollList"
import { FIELD_NAME } from "~/components/tabs/TabBody/AddMockTab/AddMockForm"

import { useActivatedMockList } from "./context"
import { loadJson, saveJson } from "./utils"

export const ActivatedMockListTab = () => {
  const { activatedMockList, addActivatedMock } = useActivatedMockList()

  return (
    <div className='flex h-full'>
      <div className='flex h-full flex-col gap-2 border-r border-solid border-slate-200 p-2'>
        <button
          title='Export Mocks'
          type='button'
          className='button-icon hover:bg-slate-300 hover:text-slate-600'
          onClick={() => {
            saveJson(activatedMockList, "mocks.json")
          }}
        >
          <FaFileExport />
        </button>
        <button
          title='Import Mocks'
          type='button'
          className='button-icon hover:bg-slate-300 hover:text-slate-600'
          onClick={() => {
            try {
              loadJson({
                onLoad: (loadedMocks) => {
                  loadedMocks.forEach(addActivatedMock)
                }
              })
            } catch (error) {
              alert(error)
            }
          }}
        >
          <FaFileImport />
        </button>
      </div>
      <ScrollList className='w-full'>
        <ul className='w-full [&>li+li]:mt-4'>
          {activatedMockList.map((mock) => (
            <li
              key={mock[FIELD_NAME.URL]}
              className='flex rounded-2xl bg-white p-4 shadow-xl'
            >
              <div className='w-full'>
                <p className='uppercase'>{mock[FIELD_NAME.METHOD]}</p>
                <p>{mock[FIELD_NAME.URL]}</p>
              </div>
              <pre className='w-full'>
                {JSON.stringify(mock[FIELD_NAME.RESPONSE], null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      </ScrollList>
    </div>
  )
}