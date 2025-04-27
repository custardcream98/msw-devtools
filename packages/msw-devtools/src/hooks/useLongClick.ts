import { useCallback, useEffect, useRef } from "react"

import { useBoolean } from "~/hooks/useBoolean"

import { useLatestRef } from "./useLatestRef"

const DEFAULT_THRESHOLD = 200
const MAX_CLICK_MOVEMENT = 5 // pixels

type Position = {
  x: number
  y: number
}

export const useLongClick = ({
  targetRef,
  onClick,
  onDrag,
  threshold = DEFAULT_THRESHOLD
}: {
  targetRef: React.RefObject<HTMLElement>
  onClick?: () => void
  onDrag?: (event: PointerEvent) => void
  /**
   * The duration in milliseconds that the user has to press the button
   * to trigger the `onLongClickStart` event.
   */
  threshold?: number
}) => {
  const [isLongClicking, longClickStart, longClickEnd] = useBoolean()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startPositionRef = useRef<Position | null>(null)

  const onDragRef = useLatestRef(onDrag)
  const onClickRef = useLatestRef(onClick)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      startPositionRef.current = { x: clientX, y: clientY }
      timerRef.current = setTimeout(() => {
        longClickStart()
        timerRef.current = null
      }, threshold)
    },
    [threshold, longClickStart]
  )

  const handleMove = useCallback(
    (event: PointerEvent) => {
      if (isLongClicking) {
        onDragRef.current?.(event)
      } else if (startPositionRef.current) {
        // If movement exceeds threshold before long click starts,
        // cancel the timer to prevent long click
        const moveDistance = Math.sqrt(
          Math.pow(event.clientX - startPositionRef.current.x, 2) +
            Math.pow(event.clientY - startPositionRef.current.y, 2)
        )
        if (moveDistance > MAX_CLICK_MOVEMENT) {
          clearTimer()
        }
      }
    },
    [onDragRef, isLongClicking, clearTimer]
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
          onClickRef.current?.()
        }
      } else if (isLongClicking) {
        longClickEnd()
      }

      startPositionRef.current = null
    },
    [clearTimer, onClickRef, longClickEnd, isLongClicking]
  )

  const handleCancel = useCallback(() => {
    clearTimer()
    if (isLongClicking) {
      longClickEnd()
    }
    startPositionRef.current = null
  }, [clearTimer, longClickEnd, isLongClicking])

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const handlePointerDown = (e: PointerEvent) => {
      // Prevent default touch behavior
      e.preventDefault()
      handleStart(e.clientX, e.clientY)
    }

    const handlePointerUp = (e: PointerEvent) => {
      handleEnd(e.clientX, e.clientY)
    }

    const abortController = new AbortController()
    const options = { signal: abortController.signal }

    target.addEventListener("pointerdown", handlePointerDown, options)
    window.addEventListener("pointermove", handleMove, options)
    window.addEventListener("pointerup", handlePointerUp, options)
    window.addEventListener("pointercancel", handleCancel, options)
    // Prevent context menu on long press
    target.addEventListener("contextmenu", (e) => e.preventDefault(), options)

    return () => {
      abortController.abort()
      clearTimer()
    }
  }, [targetRef, handleStart, handleMove, handleEnd, handleCancel, clearTimer])

  return {
    isLongClicking
  }
}
