import { clsx } from "clsx"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { FaFileExport, FaFileImport } from "react-icons/fa6"
import { HiMiniChevronDoubleRight } from "react-icons/hi2"

import { useMockList } from "~/components/contexts/mock-list"
import { ScrollList } from "~/components/ScrollList"
import { StorageKey } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"

import { loadJson, saveJson } from "./utils"

export const MockListFrame = ({ children }: React.PropsWithChildren) => {
  const { mockList, pushMock } = useMockList()

  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorageState(
    StorageKey.MOCK_LIST_SIDEBAR_OPEN,
    true
  )
  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((isOpen) => !isOpen),
    [setIsSidebarOpen]
  )

  const { t } = useTranslation()

  return (
    <div className='flex h-full'>
      <div className='flex h-full min-w-fit flex-col gap-2 border-r border-solid border-slate-200 p-2'>
        <button
          title={t("tabs.mockList.toggleSidebarButton.title")}
          className='button-icon mb-4 ml-auto mr-[2px] hover:bg-slate-300 hover:text-slate-600'
          type='button'
          onClick={toggleSidebar}
        >
          <HiMiniChevronDoubleRight
            size={16}
            className={clsx(
              "transform-gpu transition-transform duration-300",
              isSidebarOpen && "rotate-180"
            )}
          />
        </button>
        <button
          title={t("tabs.mockList.exportButton.title")}
          type='button'
          className='button-icon flex items-center hover:bg-slate-300 hover:text-slate-600'
          onClick={() => {
            saveJson(mockList, "mocks.json")
          }}
        >
          <FaFileExport size={20} className='shrink-0 p-[2px]' />
          <span
            className={clsx(
              "shrink-0",
              "grid overflow-hidden transition-[grid-template-columns] duration-300",
              isSidebarOpen ? "grid-cols-[1fr]" : "grid-cols-[0fr]"
            )}
          >
            <span className='overflow-hidden'>
              <span className='whitespace-nowrap pl-2 text-xs'>
                {t("tabs.mockList.exportButton.title")}
              </span>
            </span>
          </span>
        </button>
        <button
          title={t("tabs.mockList.importButton.title")}
          type='button'
          className='button-icon flex items-center hover:bg-slate-300 hover:text-slate-600'
          onClick={() => {
            try {
              loadJson({
                onLoad: (loadedMocks) => {
                  pushMock(...loadedMocks)
                }
              })
            } catch (error) {
              alert(error)
            }
          }}
        >
          <FaFileImport size={20} className='shrink-0 p-[2px]' />
          <span
            className={clsx(
              "shrink-0",
              "grid overflow-hidden transition-[grid-template-columns] duration-300",
              isSidebarOpen ? "grid-cols-[1fr]" : "grid-cols-[0fr]"
            )}
          >
            <span className='overflow-hidden'>
              <span className='whitespace-nowrap pl-2 text-xs'>
                {t("tabs.mockList.importButton.title")}
              </span>
            </span>
          </span>
        </button>
      </div>
      <ScrollList className='w-full'>{children}</ScrollList>
    </div>
  )
}
