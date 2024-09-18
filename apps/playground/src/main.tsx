import { installMSWDevtool } from "@custardcream/msw-devtool"
import { http, HttpResponse } from "msw"
import { setupWorker } from "msw/browser"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App.tsx"

const enableMocking = async () => {
  if (import.meta.env.PROD) {
    return
  }

  return installMSWDevtool({
    api: setupWorker(
      http.get("https://test-api.co.kr", () => {
        return HttpResponse.json({
          id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d",
          firstName: "John",
          lastName: "Maverick"
        })
      })
    )
  })
}

enableMocking().then(() =>
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
)
