import "./global.css"

import { installMSWDevtools } from "@custardcream/msw-devtools"
import { setupWorker } from "msw/browser"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App.tsx"

const enableMocking = async () => {
  // if (import.meta.env.DEV) {
  // commented out for demo purposes
  return await installMSWDevtools({
    initialOpen: true,
    setupWorker: setupWorker(),
    options: {
      onUnhandledRequest: "bypass"
    }
  })
  // }
}

enableMocking().then(() =>
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
)
