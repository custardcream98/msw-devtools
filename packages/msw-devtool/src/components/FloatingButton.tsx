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
        "msw-d-fixed msw-d-bottom-4 msw-d-right-4 msw-d-z-msw-devtool msw-d-rounded-full msw-d-border-4 msw-d-border-solid msw-d-border-background-light msw-d-p-2 msw-d-shadow-lg",
        "msw-d-transition-opacity msw-d-duration-300",
        isOpened ? "msw-d-opacity-0" : "msw-d-opacity-100 msw-d-delay-200"
      )}
      onClick={onClick}
    >
      <FaDev className='msw-d-text-gray-700' size={32} />
    </button>
  )
}
