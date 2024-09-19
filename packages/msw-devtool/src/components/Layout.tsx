import { clsx } from "clsx"
import { useState } from "react"
import { FaXmark } from "react-icons/fa6"

import { useDrag } from "~/hooks/useDrag"

export const Layout = ({
  isOpened,
  onClose,
  children
}: React.PropsWithChildren<{
  isOpened: boolean
  onClose?: () => void
}>) => {
  const [height, setHeight] = useState("50%")
  const { props } = useDrag({
    onDrag(event) {
      setHeight(`calc(100vh - ${event.clientY}px)`)
    }
  })

  return (
    <div
      className={clsx(
        "msw-d-fixed msw-d-bottom-0 msw-d-left-0 msw-d-right-0 msw-d-z-msw-devtool msw-d-h-[var(--height,0)] msw-d-overflow-hidden msw-d-rounded-tl-2xl msw-d-rounded-tr-2xl msw-d-bg-background-light msw-d-p-3 msw-d-font-sans msw-d-text-gray-700 msw-d-outline msw-d-outline-1 msw-d-outline-slate-200",
        "msw-d-transition-transform msw-d-duration-300",
        {
          "msw-d-translate-y-full": !isOpened
        }
      )}
      style={{ "--height": height }}
    >
      <button
        type='button'
        className='msw-d-absolute msw-d-left-0 msw-d-right-0 msw-d-top-0 msw-d-h-[2px] msw-d-cursor-row-resize'
        {...props}
        aria-label='drag handle'
      ></button>
      {children}
      <button
        type='button'
        className='msw-d-absolute msw-d-right-2 msw-d-top-2 msw-d-rounded-lg msw-d-bg-red-400 msw-d-p-1 msw-d-shadow-lg'
        onClick={onClose}
        aria-label='close button'
      >
        <FaXmark size={12} className='msw-d-text-background-light' />
      </button>
    </div>
  )
}
