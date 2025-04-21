import { clsx } from "clsx"
import React from "react"

export const Toggle = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      className={clsx(
        className,
        "relative h-5 w-10 shrink-0 rounded-full bg-gray-300 transition-[background-color] ease-in-out [&:has([type=checkbox]:checked)]:bg-green-600"
      )}
    >
      <input
        ref={ref}
        type='checkbox'
        className='absolute inset-0 z-10 cursor-pointer opacity-0'
        {...props}
      />
      <span className='absolute left-1 top-1/2 h-4 w-4 -translate-y-1/2 transform-gpu rounded-full bg-white transition-[transform,background-color] ease-in-out [input[type=checkbox]:checked+&]:translate-x-4'></span>
    </span>
  )
})
