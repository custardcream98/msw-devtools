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

    const handlePointerMove = (event: PointerEvent) => {
      onDragRef.current?.(event)
    }

    const handlePointerUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("pointermove", handlePointerMove)
    document.addEventListener("pointerup", handlePointerUp)

    return () => {
      document.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("pointerup", handlePointerUp)
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
