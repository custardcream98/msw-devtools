import { installMSWDevtool } from "@custardcream/msw-devtools"
import { setupWorker } from "msw/browser"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App.tsx"

const enableMocking = async () => {
  if (import.meta.env.DEV) {
    return await installMSWDevtool({
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
