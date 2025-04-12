import { type Json, type JsonMock } from "core"
import ReactDOMClient from "react-dom/client"

let promptRoot: ReactDOMClient.Root | null = null

const resetPromptRoot = () => {
  if (promptRoot) {
    promptRoot.unmount()
    promptRoot = null
  }
}

const createPromptRoot = () => {
  const root = document.createElement("div")
  root.id = "msw-devtools-prompt"
  root.style.position = "fixed"
  root.style.zIndex = "999999"
  const devtoolsRoot = document.getElementById("msw-devtools")
  if (!devtoolsRoot) {
    throw new Error("[MSW Devtools] Devtools root not found")
  }

  devtoolsRoot.appendChild(root)
  return root
}

const getPromptRoot = () => {
  if (!promptRoot) {
    const root =
      document.getElementById("msw-devtools-prompt") || createPromptRoot()

    promptRoot = ReactDOMClient.createRoot(root)
  }

  return promptRoot
}

export const createPrompt = (
  jsonMock: JsonMock,
  renderPrompt: (props: {
    jsonMock: JsonMock
    onSubmit: (response: Json) => void
  }) => React.ReactNode
) => {
  return new Promise<Json>((resolve) => {
    const root = getPromptRoot()
    root.render(
      renderPrompt({
        jsonMock,
        onSubmit: (response) => {
          resolve(response)
          resetPromptRoot()
        }
      })
    )
  })
}
