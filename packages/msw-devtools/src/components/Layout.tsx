import { clsx } from "clsx"
import { useState } from "react"

import { useDrag } from "~/hooks/useDrag"

export const Layout = ({
  isOpened,
  children
}: React.PropsWithChildren<{
  isOpened: boolean
}>) => {
  const [height, setHeight] = useState("50%")
  const { props } = useDrag({
    onDrag: (event) => {
      setHeight(`calc(100vh - ${event.clientY}px)`)
    }
  })

  return (
    <div
      className={clsx(
        "msw-d-z-msw-devtool msw-d-fixed msw-d-bottom-0 msw-d-left-0 msw-d-right-0 msw-d-flex msw-d-flex-col",
        "msw-d-overflow-hidden msw-d-rounded-tl-2xl msw-d-rounded-tr-2xl msw-d-bg-background-light msw-d-font-sans msw-d-text-gray-700 msw-d-outline msw-d-outline-1 msw-d-outline-slate-200",
        "msw-d-transition-transform msw-d-duration-300",
        !isOpened && "msw-d-translate-y-full",
        "msw-d-h-[var(--height)] msw-d-min-h-12"
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
    </div>
  )
}
