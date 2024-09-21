import { installMSWDevtool } from "@custardcream/msw-devtool"
import { setupWorker } from "msw/browser"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App.tsx"

const enableMocking = async () => {
  if (import.meta.env.DEV) {
    return installMSWDevtool({
      initialOpen: true,
      api: setupWorker()
    })
  }
}

enableMocking().then(() =>
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
)
