import "./index.css"

import { useCallback, useState } from "react"
import { FaXmark } from "react-icons/fa6"

import { FloatingButton } from "~/components/FloatingButton"
import { Layout } from "~/components/Layout"
import { Tab, TabBar, TabProvider } from "~/components/tabs/TabBar"
import { TabBody } from "~/components/tabs/TabBody"

const DevTools = ({ initialOpen = false }: { initialOpen?: boolean }) => {
  const [isOpened, setIsOpened] = useState(initialOpen)
  const open = useCallback(() => setIsOpened(true), [])
  const close = useCallback(() => setIsOpened(false), [])

  return (
    <>
      <FloatingButton isOpened={isOpened} onClick={open} />
      <Layout isOpened={isOpened}>
        <TabProvider initialTab={Tab.AddMock}>
          <TabBar>
            <button
              type='button'
              className='rounded-lg bg-red-400 p-1 shadow-lg transition-colors hover:bg-red-700'
              onClick={close}
              aria-label='close button'
            >
              <FaXmark size={12} className='text-background-light' />
            </button>
          </TabBar>
          <TabBody />
        </TabProvider>
      </Layout>
    </>
  )
}

export default DevTools
