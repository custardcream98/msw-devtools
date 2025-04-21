import { useEffect, useMemo, useRef, useState } from "react"

export const useIsDragging = ({
  onDrag
}: {
  onDrag?: (event: PointerEvent) => void
}) => {
  const onDragRef = useRef(onDrag)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (!isDragging) {
      return
    }

    const abortController = new AbortController()

    const handlePointerMove = (event: PointerEvent) => {
      onDragRef.current?.(event)
    }

    const handlePointerUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("pointermove", handlePointerMove, {
      signal: abortController.signal
    })
    document.addEventListener("pointerup", handlePointerUp, {
      signal: abortController.signal
    })

    return () => {
      abortController.abort()
    }
  }, [isDragging])

  const props = useMemo(
    () => ({
      onPointerDown: () => {
        setIsDragging(true)
      }
    }),
    []
  )

  return {
    isDragging,
    props
  }
}
