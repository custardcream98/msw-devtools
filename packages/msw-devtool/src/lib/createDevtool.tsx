import type { InstallProps } from "~/index"
import { initialize, waitForApi } from "~/lib/initializeMsw"

export const createDevtool = async ({
  initialOpen,
  ...props
}: InstallProps) => {
  initialize(props)
  await waitForApi()

  const React = (await import("react")).default
  const ReactDOM = (await import("react-dom/client")).default

  const App = React.lazy(() => import("~/App"))

  ReactDOM.createRoot(
    document.getElementById("msw-devtool") ??
      (function () {
        const root = document.createElement("div")
        root.id = "msw-devtool"
        document.body.appendChild(root)
        return root
      })()
  ).render(<App initialOpen={initialOpen} />)
}
