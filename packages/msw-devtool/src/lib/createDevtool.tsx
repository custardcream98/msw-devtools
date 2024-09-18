import {
  initialize,
  type InitializeProps,
  waitForApi
} from "~/lib/initializeMsw"

export const createDevtool = async (props: InitializeProps) => {
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
  ).render(<App />)
}
