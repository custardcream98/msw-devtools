import { startServer } from "~/lib/server"
import type { InstallProps } from "~/types"

import { initialize } from "./msw"

export const createDevtool = async ({
  initialOpen,
  isUsingServer = false,
  ...props
}: InstallProps) => {
  const loadedMocks = await initialize(props)

  if (isUsingServer) {
    startServer(loadedMocks)
  }

  const React = (await import("react")).default
  const ReactDOM = (await import("react-dom/client")).default
  const DevTools = React.lazy(() => import("~/DevTools"))

  const initializeI18n = (await import("~/lib/i18n")).default
  await initializeI18n()

  const root =
    document.getElementById("msw-devtools") ??
    (function () {
      const root = document.createElement("div")
      root.id = "msw-devtools"
      root.style.position = "fixed"
      root.style.zIndex = "999999"
      document.body.appendChild(root)

      return root
    })()

  ReactDOM.createRoot(root).render(<DevTools initialOpen={initialOpen} />)
}
