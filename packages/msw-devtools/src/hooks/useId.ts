import { useId as useIdReact } from "react"

/**
 * A hook that generates a unique ID for the component.
 * Prefixes the ID with "msw-devtools-" to avoid conflicts.
 */
export const useId = () => `msw-devtools-${useIdReact()}`
