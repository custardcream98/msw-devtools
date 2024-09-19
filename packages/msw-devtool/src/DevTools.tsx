import "./index.css"

import { clsx } from "clsx"
import { useState } from "react"
import { FaDev } from "react-icons/fa6"

import { AddMockForm } from "~/components/AddMockForm"
import { Layout } from "~/components/Layout"

const App = ({ initialOpen = false }: { initialOpen?: boolean }) => {
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
      <Layout isOpened={isOpened} onClose={() => setIsOpened(false)}>
        <AddMockForm />
      </Layout>
    </>
  )
}

export default App
