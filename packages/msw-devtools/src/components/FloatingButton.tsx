import { clsx } from "clsx"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { FaDev } from "react-icons/fa6"

import { useFloatingButtonSettings } from "~/components/contexts/floating-button"
import { StorageKey } from "~/constants"
import { useDragMove } from "~/hooks/useDragMove"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import { useLongClick } from "~/hooks/useLongClick"

const BUTTON_POSITION_MARGIN = 10
const BUTTON_WIDTH_HEIGHT = 56
const DEFAULT_POSITION = {
  x: document.documentElement.clientWidth - BUTTON_POSITION_MARGIN,
  y: document.documentElement.clientHeight - BUTTON_POSITION_MARGIN
} as const

const FIXED_DIRECTION = ["bottom", "right"] as const

type FloatingButtonProps = Omit<
  React.HTMLAttributes<HTMLButtonElement>,
  "onClick"
> & {
  onClick: () => void
}

export const FloatingButton = ({ onClick, ...props }: FloatingButtonProps) => {
  const { isLongClicking: isDragging, props: longClickProps } = useLongClick({
    onClick
  })

  const [defaultPosition, saveDefaultPosition] = useLocalStorageState(
    StorageKey.BUTTON_POSITION,
    DEFAULT_POSITION
  )
  const { position } = useDragMove({
    isDragging,
    defaultPosition,
    fixedDirection: FIXED_DIRECTION
  })
  useEffect(() => {
    saveDefaultPosition(position)
  }, [saveDefaultPosition, position])

  const { floatingButtonOpacity } = useFloatingButtonSettings()
  const { t } = useTranslation()

  return (
    <button
      {...props}
      type='button'
      className={clsx(
        "fixed left-0 top-0 rounded-full border-4 border-solid border-background-light bg-white p-2 shadow-lg",
        "translate-x-[calc(var(--x)-50%)] translate-y-[calc(var(--y)-50%)] transform-gpu",
        "opacity-[var(--opacity)]"
      )}
      style={{
        "--x": `min(max(${position.x}px, ${BUTTON_POSITION_MARGIN + BUTTON_WIDTH_HEIGHT / 2}px), calc(100vw - ${BUTTON_POSITION_MARGIN + BUTTON_WIDTH_HEIGHT / 2}px))`,
        "--y": `min(max(${position.y}px, ${BUTTON_POSITION_MARGIN + BUTTON_WIDTH_HEIGHT / 2}px), calc(100vh - ${BUTTON_POSITION_MARGIN + BUTTON_WIDTH_HEIGHT / 2}px))`,
        "--opacity": floatingButtonOpacity
      }}
      title={t("floatingButton.title")}
      {...longClickProps}
    >
      <FaDev className='text-gray-700' size={32} />
    </button>
  )
}
