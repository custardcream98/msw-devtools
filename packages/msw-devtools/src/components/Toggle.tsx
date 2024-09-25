import { clsx } from "clsx"
import { useEffect, useState } from "react"

export const Toggle = ({
  className,
  value,
  onChange
}: {
  className?: string
  value?: boolean
  onChange?: (value: boolean) => void
}) => {
  const [checked, setChecked] = useState(value)
  useEffect(() => {
    setChecked(value)
  }, [value])

  return (
    <button
      className={clsx(
        className,
        "relative h-5 w-10 shrink-0 rounded-full bg-gray-300 shadow-lg transition-[background-color] ease-in-out [&[aria-checked=true]]:bg-green-600"
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
