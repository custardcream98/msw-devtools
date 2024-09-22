import { useEffect, useState } from "react"

type Position = {
  x: number
  y: number
}
type FixedDirectionY = "top" | "bottom"
type FixedDirectionX = "left" | "right"

const between = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

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
}) => {
  const [position, setPosition] = useState<Position>(defaultPosition)

  useEffect(() => {
    if (isDragging) {
      const handlePointerMove = (event: PointerEvent) => {
        setPosition({
          x: between(event.clientX, 0, document.documentElement.clientWidth),
          y: between(event.clientY, 0, document.documentElement.clientHeight)
        })
      }

      window.addEventListener("pointermove", handlePointerMove)

      return () => {
        window.removeEventListener("pointermove", handlePointerMove)
      }
    }
  }, [isDragging])

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
    position
  }
}
