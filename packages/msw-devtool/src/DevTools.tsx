import "./index.css"

import { useState } from "react"
import { FaXmark } from "react-icons/fa6"

import { FloatingButton } from "~/components/FloatingButton"
import { Layout } from "~/components/Layout"
import { TabBar } from "~/components/TabBar"
import { Tab, TabProvider } from "~/components/TabBar/context"
import { TabBody } from "~/components/TabBody"

const DevTools = ({ initialOpen = false }: { initialOpen?: boolean }) => {
  const [isOpened, setIsOpened] = useState(initialOpen)

  return (
    <>
      <FloatingButton isOpened={isOpened} onClick={() => setIsOpened(true)} />
      <Layout isOpened={isOpened}>
        <TabProvider initialTab={Tab.AddMock}>
          <TabBar>
            <button
              type='button'
              className='msw-d-rounded-lg msw-d-bg-red-400 msw-d-p-1 msw-d-shadow-lg msw-d-transition-colors hover:msw-d-bg-red-700'
              onClick={() => setIsOpened(false)}
              aria-label='close button'
            >
              <FaXmark size={12} className='msw-d-text-background-light' />
            </button>
          </TabBar>
          <TabBody />
        </TabProvider>
      </Layout>
    </>
  )
}

export default DevTools
