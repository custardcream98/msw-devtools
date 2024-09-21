import { useEffect } from "react"

export const useIntersectionObserver = (
  target: React.RefObject<Element>,
  options: IntersectionObserverInit,
  onIntersect: IntersectionObserverCallback
) => {
  useEffect(() => {
    if (!target.current) {
      return
    }

    const observer = new IntersectionObserver(onIntersect, options)
    observer.observe(target.current)

    return () => {
      observer.disconnect()
    }
  }, [onIntersect, options, target])
}
