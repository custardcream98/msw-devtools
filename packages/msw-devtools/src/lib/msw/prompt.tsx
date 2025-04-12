import { type JsonMock } from "core"
import ReactDOMClient from "react-dom/client"

let promptRoot: ReactDOMClient.Root | null = null

const getPromptRoot = () => {
  if (!promptRoot) {
    const root = document.createElement("div")
    root.id = "msw-devtools-prompt"
    root.style.position = "fixed"
    root.style.zIndex = "999999"
    const devtoolsRoot = document.getElementById("msw-devtools")
    if (!devtoolsRoot) {
      throw new Error("[MSW Devtools] Devtools root not found")
    }

    devtoolsRoot.appendChild(root)

    promptRoot = ReactDOMClient.createRoot(root)
  }

  return promptRoot
}

export const createPrompt = (
  jsonMock: JsonMock,
  renderPrompt: (props: {
    jsonMock: JsonMock
    onSubmit: (response: string) => void
  }) => React.ReactNode
) => {
  return new Promise<string>((resolve) => {
    const root = getPromptRoot()
    root.render(
      renderPrompt({
        jsonMock,
        onSubmit: (response) => {
          resolve(response)
          root.unmount()
        }
      })
    )
  })
}
