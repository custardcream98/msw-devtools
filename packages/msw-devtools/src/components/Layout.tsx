import { clsx } from "clsx"
import { useState } from "react"

import { useIsDragging } from "~/hooks/useIsDragging"

export const Layout = ({
  isOpened,
  children
}: React.PropsWithChildren<{
  isOpened: boolean
}>) => {
  const [height, setHeight] = useState("50%")
  const { props } = useIsDragging({
    onDrag: (event) => {
      setHeight(`calc(100vh - ${event.clientY}px)`)
    }
  })

  return (
    <div
      className={clsx(
        "z-msw-devtool fixed bottom-0 left-0 right-0 flex flex-col",
        "overflow-hidden rounded-tl-2xl rounded-tr-2xl bg-background-light font-sans text-gray-700 outline outline-1 outline-slate-200",
        "transition-transform duration-300",
        !isOpened && "translate-y-full",
        "h-[var(--height)] max-h-screen min-h-12"
      )}
      style={{ "--height": height }}
    >
      <button
        type='button'
        className='absolute left-0 right-0 top-0 h-[2px] cursor-row-resize'
        {...props}
      ></button>
      {children}
    </div>
  )
}
