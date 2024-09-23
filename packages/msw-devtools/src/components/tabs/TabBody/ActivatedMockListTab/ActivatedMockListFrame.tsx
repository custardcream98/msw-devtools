import { clsx } from "clsx"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { FaFileExport, FaFileImport } from "react-icons/fa6"
import { HiMiniChevronDoubleRight } from "react-icons/hi2"

import { useActivatedMockList } from "~/components/contexts/activated-mock-list"
import { ScrollList } from "~/components/ScrollList"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import { activateMock } from "~/lib/msw"

import { loadJson, saveJson } from "./utils"

export const ActivatedMockListFrame = ({
  children
}: React.PropsWithChildren) => {
  const { activatedMockList, addActivatedMock } = useActivatedMockList()

  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorageState<boolean>(
    "ACTIVATED_MOCK_LIST_SIDEBAR_OPEN",
    true
  )
  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((isOpen) => !isOpen),
    [setIsSidebarOpen]
  )

  const { t } = useTranslation()

  return (
    <div className='flex h-full'>
      <div className='flex h-full min-w-fit flex-col gap-2 border-r border-slate-200 p-2'>
        <button
          title={t("tabs.activatedMockList.toggleSidebarButton.title")}
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
          title={t("tabs.activatedMockList.exportButton.title")}
          type='button'
          className='button-icon flex items-center hover:bg-slate-300 hover:text-slate-600'
          onClick={() => {
            saveJson(activatedMockList, "mocks.json")
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
                {t("tabs.activatedMockList.exportButton.title")}
              </span>
            </span>
          </span>
        </button>
        <button
          title={t("tabs.activatedMockList.importButton.title")}
          type='button'
          className='button-icon flex items-center hover:bg-slate-300 hover:text-slate-600'
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
                {t("tabs.activatedMockList.importButton.title")}
              </span>
            </span>
          </span>
        </button>
      </div>
      <ScrollList className='w-full'>{children}</ScrollList>
    </div>
  )
}
