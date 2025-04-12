import { clsx } from "clsx"
import React, { useEffect, useState } from "react"

type ToggleProps = {
  className?: string
  value?: boolean
  onChange?: (value: boolean) => void
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, value, onChange }, ref) => {
    const [checked, setChecked] = useState(value)
    useEffect(() => {
      setChecked(value)
    }, [value])

    return (
      <button
        ref={ref}
        className={clsx(
          className,
          "relative h-5 w-10 shrink-0 rounded-full bg-gray-300 transition-[background-color] ease-in-out [&[aria-checked=true]]:bg-green-600"
        )}
        type='button'
        role='switch'
        aria-checked={checked}
        onClick={() => {
          setChecked((prev) => !prev)
          onChange?.(!checked)
        }}
      >
        <span className='absolute left-1 top-1/2 h-4 w-4 -translate-y-1/2 transform-gpu rounded-full bg-white transition-[transform,background-color] ease-in-out [button[aria-checked=true]>&]:translate-x-4'></span>
      </button>
    )
  }
)
