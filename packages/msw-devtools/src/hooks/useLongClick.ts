import { useCallback, useEffect, useRef } from "react"

import { useBoolean } from "~/hooks/useBoolean"

const DEFAULT_THRESHOLD = 200
const MAX_CLICK_MOVEMENT = 5 // pixels

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
  const timerRef = useRef<number | null>(null)
  const startPositionRef = useRef<{ x: number; y: number } | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      startPositionRef.current = { x: clientX, y: clientY }
      timerRef.current = window.setTimeout(() => {
        longClickStart()
        timerRef.current = null
      }, threshold)
    },
    [threshold, longClickStart]
  )

  const handleEnd = useCallback(
    (clientX: number, clientY: number) => {
      const startPosition = startPositionRef.current
      if (!startPosition) return

      if (timerRef.current !== null) {
        clearTimer()
        // Calculate movement distance to prevent triggering click on slight movements
        const moveDistance = Math.sqrt(
          Math.pow(clientX - startPosition.x, 2) +
            Math.pow(clientY - startPosition.y, 2)
        )
        // Only trigger click if movement was minimal
        if (moveDistance <= MAX_CLICK_MOVEMENT) {
          onClick?.()
        }
      } else {
        longClickEnd()
      }

      startPositionRef.current = null
    },
    [clearTimer, onClick, longClickEnd]
  )

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const handlePointerDown = (e: PointerEvent) => {
      handleStart(e.clientX, e.clientY)
    }

    const handlePointerUp = (e: PointerEvent) => {
      handleEnd(e.clientX, e.clientY)
    }

    const handlePointerCancel = () => {
      clearTimer()
      longClickEnd()
      startPositionRef.current = null
    }

    const abortController = new AbortController()

    target.addEventListener("pointerdown", handlePointerDown, {
      signal: abortController.signal
    })
    window.addEventListener("pointerup", handlePointerUp, {
      signal: abortController.signal
    })
    window.addEventListener("pointercancel", handlePointerCancel, {
      signal: abortController.signal
    })
    // Prevent context menu on long press
    target.addEventListener("contextmenu", (e) => e.preventDefault(), {
      signal: abortController.signal
    })

    return () => {
      abortController.abort()
      clearTimer()
    }
  }, [targetRef, handleStart, handleEnd, clearTimer, longClickEnd])

  return {
    isLongClicking
  }
}
