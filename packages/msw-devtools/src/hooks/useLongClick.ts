import { useCallback, useRef } from "react"

const DEFAULT_THRESHOLD = 100

export const useLongClick = ({
  onClick,
  onLongClickStart,
  onLongClickEnd,
  threshold = DEFAULT_THRESHOLD
}: {
  onClick: React.PointerEventHandler<HTMLElement>
  onLongClickStart: React.PointerEventHandler<HTMLElement>
  onLongClickEnd: () => void
  /**
   * The duration in milliseconds that the user has to press the button
   * to trigger the `onLongClickStart` event.
   */
  threshold?: number
}) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const start: React.PointerEventHandler<HTMLElement> = useCallback(
    (event) => {
      timer.current = setTimeout(() => {
        onLongClickStart(event)
        timer.current = null
      }, threshold)
    },
    [threshold, onLongClickStart]
  )

  const clear = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }, [])
  const handlePointerUp: React.PointerEventHandler<HTMLElement> = useCallback(
    (event) => {
      if (timer.current !== null) {
        clear()
        onClick(event)
      } else {
        onLongClickEnd()
      }
    },
    [onClick, onLongClickEnd, clear]
  )

  const handlePointerLeave: React.PointerEventHandler<HTMLElement> =
    useCallback(() => {
      if (timer.current === null) {
        onLongClickEnd()
      } else {
        clear()
      }
    }, [clear, onLongClickEnd])

  return {
    onPointerDown: start,
    onPointerUp: handlePointerUp,
    onPointerLeave: handlePointerLeave
  }
}
