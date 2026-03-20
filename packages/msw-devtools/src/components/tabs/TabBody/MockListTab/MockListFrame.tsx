import { clsx } from "clsx"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { FaFileCircleXmark, FaFileExport, FaFileImport } from "react-icons/fa6"
import { HiMiniChevronDoubleRight } from "react-icons/hi2"

import { useMockList } from "~/components/contexts/mock-list"
import { ScrollList } from "~/components/ScrollList"
import { StorageKey } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"

import { loadJson, saveJson } from "./utils"

const SidebarButton = ({
  icon,
  label,
  onClick,
  isSidebarOpen,
  title
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  isSidebarOpen: boolean
  title: string
}) => (
  <button
    title={title}
    type='button'
    className='flex items-center rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700'
    onClick={onClick}
  >
    {icon}
    <span
      className={clsx(
        "shrink-0",
        "grid overflow-hidden transition-[grid-template-columns] duration-300",
        isSidebarOpen ? "grid-cols-[1fr]" : "grid-cols-[0fr]"
      )}
    >
      <span className='overflow-hidden'>
        <span className='whitespace-nowrap pl-2 text-xs'>{label}</span>
      </span>
    </span>
  </button>
)

export const MockListFrame = ({ children }: React.PropsWithChildren) => {
  const { mockList, pushMock, clearAllMocks } = useMockList()

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
      <div className='flex h-full min-w-fit flex-col gap-1 border-r border-slate-200 p-1.5'>
        <button
          title={t("tabs.mockList.toggleSidebarButton.title")}
          className='mb-3 ml-auto rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700'
          type='button'
          onClick={toggleSidebar}
        >
          <HiMiniChevronDoubleRight
            size={14}
            className={clsx(
              "transform-gpu transition-transform duration-200",
              isSidebarOpen && "rotate-180"
            )}
          />
        </button>
        <SidebarButton
          title={t("tabs.mockList.exportButton.title")}
          icon={<FaFileExport size={16} className='shrink-0' />}
          label={t("tabs.mockList.exportButton.title")}
          isSidebarOpen={isSidebarOpen}
          onClick={() => {
            saveJson(mockList, "mocks.json")
          }}
        />
        <SidebarButton
          title={t("tabs.mockList.importButton.title")}
          icon={<FaFileImport size={16} className='shrink-0' />}
          label={t("tabs.mockList.importButton.title")}
          isSidebarOpen={isSidebarOpen}
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
        />
        <SidebarButton
          title={t("tabs.mockList.clearMockButton.title")}
          icon={<FaFileCircleXmark size={16} className='shrink-0' />}
          label={t("tabs.mockList.clearMockButton.title")}
          isSidebarOpen={isSidebarOpen}
          onClick={() => {
            if (window.confirm(t("tabs.mockList.clearMockButton.confirm"))) {
              clearAllMocks()
            }
          }}
        />
      </div>
      <ScrollList className='w-full'>{children}</ScrollList>
    </div>
  )
}
