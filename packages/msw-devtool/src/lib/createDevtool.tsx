import { initialize, waitForApi } from "~/lib/initializeMsw"
import type { InstallProps } from "~/lib/install"

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
    document.getElementById("root-dev") ??
      (function () {
        const root = document.createElement("div")
        root.id = "root-dev"
        document.body.appendChild(root)
        return root
      })()
  ).render(<App initialOpen={initialOpen} />)
}
