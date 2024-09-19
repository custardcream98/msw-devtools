import { useState } from "react"

import { useDrag } from "~/hooks/useDrag"

export const Layout = ({
  onClose,
  children
}: React.PropsWithChildren<{
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
      className='msw-d-fixed msw-d-bottom-0 msw-d-left-0 msw-d-right-0 msw-d-z-msw-devtool msw-d-h-[var(--height)] msw-d-bg-black msw-d-text-white'
      style={{ "--height": height }}
    >
      <div className='msw-d-flex'>
        <button
          type='button'
          className='msw-d-h-3 msw-d-w-full msw-d-bg-slate-400'
          {...props}
        ></button>
        <button type='button' className='msw-d-bg-red-400' onClick={onClose}>
          close
        </button>
      </div>
      {children}
    </div>
  )
}
