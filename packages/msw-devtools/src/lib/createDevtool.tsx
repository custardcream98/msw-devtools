import { server } from "~/lib/server"
import { viteHmr } from "~/lib/vite"

import { initialize, type InitializeProps } from "./msw"

export type CreateDevtoolProps = InitializeProps & {
  initialOpen?: boolean
}

export const createDevtool = async ({
  initialOpen,
  ...props
}: CreateDevtoolProps) => {
  const loadedMocks = await initialize(props)

  viteHmr(loadedMocks)
  server(loadedMocks)

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
