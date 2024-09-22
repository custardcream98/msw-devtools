import { useCallback } from "react"

import { useBoolean } from "~/hooks/useBoolean"

const DEFAULT_THRESHOLD = 100

export const useLongClick = ({
  onClick,
  threshold = DEFAULT_THRESHOLD
}: {
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

  return {
    isLongClicking,
    props: { onPointerDown: start }
  }
}
