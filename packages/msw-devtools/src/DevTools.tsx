import "./index.css"

import { useCallback, useId } from "react"
import { useTranslation } from "react-i18next"
import { FaXmark } from "react-icons/fa6"

import { FloatingButtonSettingsProvider } from "~/components/contexts/floating-button"
import { RequestLogProvider } from "~/components/contexts/request-log"
import { FloatingButton } from "~/components/FloatingButton"
import { Layout } from "~/components/Layout"
import { TabBar, TabProvider } from "~/components/tabs/TabBar"
import { TabBody } from "~/components/tabs/TabBody"
import { StorageKey } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"

const DevTools = ({ initialOpen = true }: { initialOpen?: boolean }) => {
  const [isOpened, setIsOpened] = useLocalStorageState(
    StorageKey.OPEN,
    initialOpen
  )
  const { t } = useTranslation()

  const toggle = useCallback(() => setIsOpened((prev) => !prev), [setIsOpened])
  const close = useCallback(() => setIsOpened(false), [setIsOpened])

  const layoutId = useId()

  return (
    <FloatingButtonSettingsProvider>
      <FloatingButton
        onClick={toggle}
        aria-expanded={isOpened}
        aria-controls={layoutId}
      />
      <Layout
        role='region'
        aria-label='MSW Devtools'
        id={layoutId}
        isOpened={isOpened}
      >
        <TabProvider>
          <RequestLogProvider>
            <TabBar>
              <button
                type='button'
                className='rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'
                onClick={close}
                title={t("closeButton.title")}
              >
                <FaXmark size={14} />
              </button>
            </TabBar>
            <TabBody />
          </RequestLogProvider>
        </TabProvider>
      </Layout>
    </FloatingButtonSettingsProvider>
  )
}

export default DevTools
