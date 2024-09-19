import "./index.css"

import { useState } from "react"

import { AddMockForm } from "~/components/AddMockForm"
import { Layout } from "~/components/Layout"

const App = ({ initialOpen }: { initialOpen?: boolean }) => {
  const [isOn, setIsOn] = useState(initialOpen)

  if (!isOn) {
    return (
      <button
        className='msw-d-fixed msw-d-bottom-2 msw-d-right-2 msw-d-z-msw-devtool msw-d-bg-slate-600'
        type='button'
        onClick={() => setIsOn(true)}
      >
        Open MSW Devtool
      </button>
    )
  }

  return (
    <Layout onClose={() => setIsOn(false)}>
      <AddMockForm />
    </Layout>
  )
}

export default App
