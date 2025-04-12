import { type Json, type JsonMock } from "core"
import ReactDOMClient from "react-dom/client"

import { DEVTOOLS_ROOT_ID, PROMPT_CONTAINER_ID } from "~/constants"

type PromptRenderProps = {
  jsonMock: JsonMock
  onSubmit: (response: Json) => void
}

type PromptRenderer = (props: PromptRenderProps) => React.ReactNode

class PromptRegistry {
  rootElement: HTMLDivElement | null = null
  reactRoots = new Map<string, ReactDOMClient.Root>()

  getRootElement() {
    if (!this.rootElement) {
      this.rootElement = this.createRootElement()
    }
    return this.rootElement
  }

  createRootElement() {
    const root = document.createElement("div")
    root.id = PROMPT_CONTAINER_ID
    root.style.position = "fixed"
    root.style.zIndex = "999999"

    const devtoolsRoot = document.getElementById(DEVTOOLS_ROOT_ID)
    if (!devtoolsRoot) {
      throw new Error("[MSW Devtools] Devtools root not found")
    }

    devtoolsRoot.appendChild(root)
    return root
  }

  generatePromptId() {
    return `${PROMPT_CONTAINER_ID}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  createPromptElement(promptId: string) {
    const element = document.createElement("div")
    element.id = promptId
    element.className = "hidden last:block" // Only show the last prompt

    this.getRootElement().appendChild(element)
    return element
  }

  getReactRoot(promptId: string) {
    let reactRoot = this.reactRoots.get(promptId)

    if (!reactRoot) {
      const element =
        document.getElementById(promptId) || this.createPromptElement(promptId)
      reactRoot = ReactDOMClient.createRoot(element)
      this.reactRoots.set(promptId, reactRoot)
    }

    return reactRoot
  }

  removePrompt(promptId: string) {
    const reactRoot = this.reactRoots.get(promptId)
    if (reactRoot) {
      reactRoot.unmount()
      this.reactRoots.delete(promptId)

      const promptElement = document.getElementById(promptId)
      promptElement?.remove()
    }
  }
}

const promptRegistry = new PromptRegistry()

/**
 * Creates and renders a prompt with the given mock data
 */
export const createPrompt = (
  jsonMock: JsonMock,
  renderPrompt: PromptRenderer
): Promise<Json> => {
  const promptId = promptRegistry.generatePromptId()

  return new Promise<Json>((resolve) => {
    const reactRoot = promptRegistry.getReactRoot(promptId)

    reactRoot.render(
      renderPrompt({
        jsonMock,
        onSubmit: (response) => {
          resolve(response)
          promptRegistry.removePrompt(promptId)
        }
      })
    )
  })
}
