import { useState } from "react"

import { useIntersectionObserver } from "~/hooks/useIntersectionObserver"

export const useIsIntersecting = (target: React.RefObject<Element>) => {
  const [isIntersecting, setIsIntersecting] = useState(true)

  useIntersectionObserver(target, { threshold: 0.5 }, ([entry]) => {
    setIsIntersecting(entry.isIntersecting)
  })

  return isIntersecting
}
