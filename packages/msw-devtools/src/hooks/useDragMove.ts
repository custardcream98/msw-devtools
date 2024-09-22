import { useCallback, useEffect, useState } from "react"

import { useDrag } from "./useDrag"

type Position = {
  x: number
  y: number
}
type FixedDirectionY = "top" | "bottom"
type FixedDirectionX = "left" | "right"

export const useDragMove = ({
  isDragging,
  fixedDirection: [fixedY, fixedX],
  defaultPosition
}: {
  isDragging: boolean
  /**
   * You should provide direction to be fixed when the window is resized.
   */
  fixedDirection:
    | Readonly<[FixedDirectionY, FixedDirectionX]>
    | [FixedDirectionY, FixedDirectionX]
  defaultPosition: Position
}): {
  position: Position
  props: {
    onPointerMove: React.PointerEventHandler<HTMLElement>
  }
} => {
  const [position, setPosition] = useState<Position>(defaultPosition)

  const dragProps = useDrag({
    isDragging,
    onDrag: useCallback((event) => {
      setPosition({
        x: event.clientX,
        y: event.clientY
      })
    }, [])
  })

  useEffect(() => {
    const bottomFromBottom =
      document.documentElement.clientHeight - defaultPosition.y
    const rightFromRight =
      document.documentElement.clientWidth - defaultPosition.x

    const handleWindowResize = () => {
      setPosition((prevPosition) => {
        const currentWindowSize = {
          clientWidth: document.documentElement.clientWidth,
          clientHeight: document.documentElement.clientHeight
        }

        return {
          x:
            fixedX === "left"
              ? Math.min(prevPosition.x, currentWindowSize.clientWidth)
              : Math.max(currentWindowSize.clientWidth - rightFromRight, 0),
          y:
            fixedY === "top"
              ? Math.min(prevPosition.y, currentWindowSize.clientHeight)
              : Math.max(currentWindowSize.clientHeight - bottomFromBottom, 0)
        }
      })
    }

    const observer = new ResizeObserver(handleWindowResize)
    observer.observe(document.documentElement)

    return () => {
      observer.disconnect()
    }
  }, [defaultPosition.x, defaultPosition.y, fixedX, fixedY])

  return {
    position,
    props: {
      ...dragProps
    }
  }
}
