import { useCallback, useEffect } from "react"

import { useBoolean } from "~/hooks/useBoolean"

const DEFAULT_THRESHOLD = 200

export const useLongClick = ({
  targetRef,
  onClick,
  threshold = DEFAULT_THRESHOLD
}: {
  targetRef: React.RefObject<HTMLElement>
  onClick?: () => void
  /**
   * The duration in milliseconds that the user has to press the button
   * to trigger the `onLongClickStart` event.
   */
  threshold?: number
}) => {
  const [isLongClicking, longClickStart, longClickEnd] = useBoolean()

  const start = useCallback(() => {
    let timerId: number | null = window.setTimeout(() => {
      longClickStart()
      timerId = null
    }, threshold)

    const handlePointerUp = () => {
      window.removeEventListener("pointerup", handlePointerUp)

      if (timerId !== null) {
        window.clearTimeout(timerId)
        onClick?.()
      } else {
        longClickEnd()
      }
    }

    window.addEventListener("pointerup", handlePointerUp)
  }, [threshold, longClickStart, longClickEnd, onClick])

  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.addEventListener("pointerdown", start)
    }
  }, [start, targetRef])

  return {
    isLongClicking
  }
}
