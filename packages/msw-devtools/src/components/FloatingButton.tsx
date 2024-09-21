import { clsx } from "clsx"
import { FaDev } from "react-icons/fa6"

export const FloatingButton = ({
  isOpened,
  onClick
}: {
  isOpened: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) => {
  return (
    <button
      type='button'
      className={clsx(
        "z-msw-devtool fixed bottom-4 right-4 rounded-full border-4 border-solid border-background-light p-2 shadow-lg",
        "transition-opacity duration-300",
        isOpened ? "opacity-0" : "opacity-100 delay-200"
      )}
      onClick={onClick}
    >
      <FaDev className='text-gray-700' size={32} />
    </button>
  )
}
