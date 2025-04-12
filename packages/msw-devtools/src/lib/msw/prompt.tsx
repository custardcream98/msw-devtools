import { type Json, type JsonMock } from "core"
import ReactDOMClient from "react-dom/client"

let promptRootElement: HTMLDivElement | null = null
const promptReactRoots = new Map<string, ReactDOMClient.Root>()

const createPromptRootElement = () => {
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

const getPromptRootElement = () => {
  if (!promptRootElement) {
    promptRootElement = createPromptRootElement()
  }

  return promptRootElement
}

const generatePromptId = () =>
  `msw-devtools-prompt-${Date.now()}-${Math.random().toString(36)}`

const resetPromptElement = (promptId: string) => {
  const root = promptReactRoots.get(promptId)
  if (root) {
    root.unmount()
    promptReactRoots.delete(promptId)
    const promptElement = document.getElementById(promptId)
    promptElement?.remove()
  }
}

const createPromptElement = (promptId: string) => {
  const root = document.createElement("div")
  root.id = promptId
  root.className = "hidden last:block"

  const promptRootElement = getPromptRootElement()

  promptRootElement.appendChild(root)

  return root
}

const getPromptElement = (promptId: string) => {
  let root = promptReactRoots.get(promptId)

  if (!root) {
    const element =
      document.getElementById(promptId) || createPromptElement(promptId)
    root = ReactDOMClient.createRoot(element)
    promptReactRoots.set(promptId, root)
  }

  return root
}

export const createPrompt = (
  jsonMock: JsonMock,
  renderPrompt: (props: {
    jsonMock: JsonMock
    onSubmit: (response: Json) => void
  }) => React.ReactNode
) => {
  const promptId = generatePromptId()

  return new Promise<Json>((resolve) => {
    const root = getPromptElement(promptId)
    root.render(
      renderPrompt({
        jsonMock,
        onSubmit: (response) => {
          resolve(response)
          resetPromptElement(promptId)
        }
      })
    )
  })
}
