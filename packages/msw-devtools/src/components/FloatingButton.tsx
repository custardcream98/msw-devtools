import { clsx } from "clsx"
import { FaDev } from "react-icons/fa6"

import { useBoolean } from "~/hooks/useBoolean"
import { useDragMove } from "~/hooks/useDragMove"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import { useLongClick } from "~/hooks/useLongClick"

const DEFAULT_POSITION = {
  x: document.documentElement.clientWidth - 50,
  y: document.documentElement.clientHeight - 50
} as const

const FIXED_DIRECTION = ["bottom", "right"] as const

export const FloatingButton = ({
  isOpened,
  onClick
}: {
  isOpened: boolean
  onClick: React.PointerEventHandler<HTMLButtonElement>
}) => {
  const [isDragging, dragStart, dragEnd] = useBoolean()
  const longClickProps = useLongClick({
    onClick,
    onLongClickStart: dragStart,
    onLongClickEnd: () => {
      dragEnd()
      saveDefaultPosition(position)
    }
  })

  const [defaultPosition, saveDefaultPosition] = useLocalStorageState(
    "MSW_DEVTOOLS_BUTTON_POSITION",
    DEFAULT_POSITION
  )
  const { position, props: dragProps } = useDragMove({
    isDragging,
    defaultPosition,
    fixedDirection: FIXED_DIRECTION
  })

  return (
    <button
      type='button'
      className={clsx(
        "z-msw-devtool fixed left-0 top-0 rounded-full border-4 border-solid border-background-light p-2 shadow-lg",
        "transition-opacity duration-300",
        "translate-x-[var(--x)] translate-y-[var(--y)] transform-gpu",
        isOpened ? "pointer-events-none opacity-0" : "opacity-100 delay-100"
      )}
      {...longClickProps}
      {...dragProps}
      style={{
        "--x": `calc(${position.x}px - 50%)`,
        "--y": `calc(${position.y}px - 50%)`
      }}
    >
      <FaDev className='text-gray-700' size={32} />
    </button>
  )
}
