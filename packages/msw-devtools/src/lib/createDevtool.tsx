import { server } from "~/lib/server"

import { initialize, type InitializeProps } from "./msw"

export type CreateDevtoolProps = InitializeProps & {
  /**
   * Whether the devtool should be open by default.
   *
   * @default true
   */
  initialOpen?: boolean
  /**
   * Whether should be connected to the @custardcream/msw-devtools-server
   *
   * @default false
   */
  isUsingServer?: boolean
}

export const createDevtool = async ({
  initialOpen,
  isUsingServer = false,
  ...props
}: CreateDevtoolProps) => {
  const loadedMocks = await initialize(props)

  if (isUsingServer) {
    server(loadedMocks)
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
