import { clsx } from "clsx"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { FaDev } from "react-icons/fa6"

import { useFloatingButtonSettings } from "~/components/contexts/floating-button"
import { useDragMove } from "~/hooks/useDragMove"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import { useLongClick } from "~/hooks/useLongClick"

const DEFAULT_POSITION = {
  x: document.documentElement.clientWidth - 50,
  y: document.documentElement.clientHeight - 50
} as const

const FIXED_DIRECTION = ["bottom", "right"] as const

export const FloatingButton = ({ onClick }: { onClick: () => void }) => {
  const { isLongClicking: isDragging, props: longClickProps } = useLongClick({
    onClick
  })

  const [defaultPosition, saveDefaultPosition] = useLocalStorageState(
    "BUTTON_POSITION",
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
      type='button'
      className={clsx(
        "z-msw-devtool fixed left-0 top-0 rounded-full border-4 border-solid border-background-light bg-white p-2 shadow-lg",
        "translate-x-[var(--x)] translate-y-[var(--y)] transform-gpu",
        "opacity-[var(--opacity)]"
      )}
      style={{
        "--x": `calc(${position.x}px - 50%)`,
        "--y": `calc(${position.y}px - 50%)`,
        "--opacity": floatingButtonOpacity
      }}
      title={t("floatingButton.title")}
      {...longClickProps}
    >
      <FaDev className='text-gray-700' size={32} />
    </button>
  )
}
