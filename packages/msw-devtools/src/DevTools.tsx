import "./index.css"

import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { FaXmark } from "react-icons/fa6"

import { FloatingButtonSettingsProvider } from "~/components/contexts/floating-button"
import { FloatingButton } from "~/components/FloatingButton"
import { Layout } from "~/components/Layout"
import { TabBar, TabProvider } from "~/components/tabs/TabBar"
import { TabBody } from "~/components/tabs/TabBody"
import { StorageKey } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"

const DevTools = ({ initialOpen = false }: { initialOpen?: boolean }) => {
  const [isOpened, setIsOpened] = useLocalStorageState(
    StorageKey.OPEN,
    initialOpen
  )
  const { t } = useTranslation()

  const toggle = useCallback(() => setIsOpened((prev) => !prev), [setIsOpened])
  const close = useCallback(() => setIsOpened(false), [setIsOpened])

  return (
    <FloatingButtonSettingsProvider>
      <FloatingButton onClick={toggle} />
      <Layout isOpened={isOpened}>
        <TabProvider>
          <TabBar>
            <button
              type='button'
              className='rounded-lg bg-red-400 p-1 shadow-lg transition-colors hover:bg-red-700'
              onClick={close}
              title={t("closeButton.title")}
            >
              <FaXmark size={12} className='text-background-light' />
            </button>
          </TabBar>
          <TabBody />
        </TabProvider>
      </Layout>
    </FloatingButtonSettingsProvider>
  )
}

export default DevTools
