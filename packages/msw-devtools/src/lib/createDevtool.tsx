import { DEVTOOLS_ROOT_ID } from "~/constants"
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
    await startServer(loadedMocks)
  }

  const React = (await import("react")).default
  const ReactDOM = (await import("react-dom/client")).default
  const DevTools = React.lazy(() => import("~/DevTools"))

  const initializeI18n = (await import("~/lib/i18n")).default
  await initializeI18n()

  const root =
    document.getElementById(DEVTOOLS_ROOT_ID) ??
    (function () {
      const root = document.createElement("div")
      root.id = DEVTOOLS_ROOT_ID
      root.style.position = "fixed"
      root.style.zIndex = "999999"
      document.body.appendChild(root)

      return root
    })()

  ReactDOM.createRoot(root).render(<DevTools initialOpen={initialOpen} />)
}
