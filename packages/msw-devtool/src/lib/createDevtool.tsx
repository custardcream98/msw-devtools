import { initialize, type InitializeProps } from "./msw"

export type CreateDevtoolProps = InitializeProps & {
  initialOpen?: boolean
}

export const createDevtool = async ({
  initialOpen,
  ...props
}: CreateDevtoolProps) => {
  await initialize(props)

  const React = (await import("react")).default
  const ReactDOM = (await import("react-dom/client")).default

  const DevTools = React.lazy(() => import("~/DevTools"))

  ReactDOM.createRoot(
    document.getElementById("msw-devtool") ??
      (function () {
        const root = document.createElement("div")
        root.id = "msw-devtool"
        document.body.appendChild(root)
        return root
      })()
  ).render(<DevTools initialOpen={initialOpen} />)
}
