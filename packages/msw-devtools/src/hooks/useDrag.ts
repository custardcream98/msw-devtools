import { useCallback } from "react"

export const useDrag = ({
  isDragging,
  onDrag
}: {
  isDragging: boolean
  onDrag: React.PointerEventHandler<HTMLElement>
}) => {
  const handlePointerMove: React.PointerEventHandler<HTMLElement> = useCallback(
    (event) => {
      if (isDragging) {
        onDrag(event)
      }
    },
    [isDragging, onDrag]
  )

  return {
    onPointerMove: handlePointerMove
  }
}
