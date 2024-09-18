import "./index.css"

import { useState } from "react"

import { Layout } from "~/components/Layout"

const App = ({ initialOpen }: { initialOpen?: boolean }) => {
  const [isOn, setIsOn] = useState(initialOpen)

  if (!isOn) {
    return (
      <button
        className='fixed bottom-2 right-2 bg-slate-600'
        type='button'
        onClick={() => setIsOn(true)}
      >
        Open MSW Devtool
      </button>
    )
  }

  return <Layout onClose={() => setIsOn(false)}>Devtool Body</Layout>
}

export default App
