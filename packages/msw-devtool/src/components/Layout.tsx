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
      className='height fixed bottom-0 left-0 right-0 bg-black text-white'
      style={{ "--height": height }}
    >
      <div className='flex'>
        <button
          type='button'
          className='h-3 w-full bg-slate-400'
          {...props}
        ></button>
        <button type='button' className='bg-red-400' onClick={onClose}>
          close
        </button>
      </div>
      {children}
    </div>
  )
}
