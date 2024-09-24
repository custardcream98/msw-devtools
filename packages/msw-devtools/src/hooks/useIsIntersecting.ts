import { useCallback, useState } from "react"

import { useIntersectionObserver } from "~/hooks/useIntersectionObserver"

const OPTIONS = { threshold: 0.5 } as const

export const useIsIntersecting = (target: React.RefObject<Element>) => {
  const [isIntersecting, setIsIntersecting] = useState(true)

  useIntersectionObserver(
    target,
    OPTIONS,
    useCallback(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, [])
  )

  return isIntersecting
}
