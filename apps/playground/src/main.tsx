import { installMSWDevtool } from "@custardcream/msw-devtool"
import { setupWorker } from "msw/browser"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App.tsx"

installMSWDevtool({ api: setupWorker() })

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
