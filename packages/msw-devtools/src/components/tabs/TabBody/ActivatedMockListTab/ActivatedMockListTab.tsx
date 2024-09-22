import { useTranslation } from "react-i18next"
import { FaFileExport, FaFileImport } from "react-icons/fa6"

import { useActivatedMockList } from "~/components/contexts/activated-mock-list"
import { ScrollList } from "~/components/ScrollList"
import { FIELD_NAME } from "~/constants"
import { activateMock } from "~/lib/msw"

import { ActivatedMockCard } from "./ActivatedMockCard"
import { loadJson, saveJson } from "./utils"

export const ActivatedMockListTab = () => {
  const { activatedMockList, addActivatedMock } = useActivatedMockList()

  const { t } = useTranslation()

  return (
    <div className='flex h-full'>
      <div className='flex h-full flex-col gap-2 border-r border-solid border-slate-200 p-2'>
        <button
          title={t("tabs.activatedMockList.exportButton.title")}
          type='button'
          className='button-icon hover:bg-slate-300 hover:text-slate-600'
          onClick={() => {
            saveJson(activatedMockList, "mocks.json")
          }}
        >
          <FaFileExport />
        </button>
        <button
          title={t("tabs.activatedMockList.importButton.title")}
          type='button'
          className='button-icon hover:bg-slate-300 hover:text-slate-600'
          onClick={() => {
            try {
              loadJson({
                onLoad: (loadedMocks) => {
                  loadedMocks.forEach((mock) => {
                    activateMock(mock)
                    addActivatedMock(mock)
                  })
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
            <li key={mock[FIELD_NAME.URL]}>
              <ActivatedMockCard {...mock} />
            </li>
          ))}
        </ul>
      </ScrollList>
    </div>
  )
}
