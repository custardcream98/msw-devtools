import "./index.css"

import { clsx } from "clsx"
import { useState } from "react"
import { FaDev, FaXmark } from "react-icons/fa6"

import { Layout } from "~/components/Layout"
import { TabBar } from "~/components/TabBar"
import { Tab, TabProvider } from "~/components/TabBar/context"
import { TabBody } from "~/components/TabBody"

const DevTools = ({ initialOpen = false }: { initialOpen?: boolean }) => {
  const [isOpened, setIsOpened] = useState(initialOpen)

  return (
    <>
      <button
        type='button'
        className={clsx(
          "msw-d-fixed msw-d-bottom-4 msw-d-right-4 msw-d-z-msw-devtool msw-d-rounded-full msw-d-border-4 msw-d-border-solid msw-d-border-background-light msw-d-p-2 msw-d-shadow-lg",
          "msw-d-transition-opacity msw-d-duration-300",
          isOpened ? "msw-d-opacity-0" : "msw-d-opacity-100 msw-d-delay-200"
        )}
        onClick={() => setIsOpened(true)}
      >
        <FaDev className='msw-d-text-gray-700' size={32} />
      </button>
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
