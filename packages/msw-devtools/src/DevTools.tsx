import "./index.css"

import { useTranslation } from "react-i18next"
import { FaXmark } from "react-icons/fa6"

import { FloatingButtonSettingsProvider } from "~/components/contexts/floating-button"
import { FloatingButton } from "~/components/FloatingButton"
import { Layout } from "~/components/Layout"
import { Tab, TabBar, TabProvider } from "~/components/tabs/TabBar"
import { TabBody } from "~/components/tabs/TabBody"
import { useBoolean } from "~/hooks/useBoolean"

const DevTools = ({ initialOpen = false }: { initialOpen?: boolean }) => {
  const [isOpened, , close, toggle] = useBoolean(initialOpen)
  const { t } = useTranslation()

  return (
    <FloatingButtonSettingsProvider>
      <FloatingButton onClick={toggle} />
      <Layout isOpened={isOpened}>
        <TabProvider initialTab={Tab.AddMock}>
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
