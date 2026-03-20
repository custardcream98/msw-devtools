import { clsx } from "clsx"
import React from "react"

export const Toggle = ({
  ref,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>
}) => {
  return (
    <span
      className={clsx(
        className,
        "relative h-4 w-8 shrink-0 rounded-full bg-slate-300 transition-[background-color] ease-in-out [&:has([type=checkbox]:checked)]:bg-green-600"
      )}
    >
      <input
        ref={ref}
        type='checkbox'
        className='absolute inset-0 z-10 cursor-pointer opacity-0'
        {...props}
      />
      <span className='absolute left-0.5 top-1/2 h-3 w-3 -translate-y-1/2 transform-gpu rounded-full bg-white shadow-sm transition-[transform,background-color] ease-in-out [input[type=checkbox]:checked+&]:translate-x-4'></span>
    </span>
  )
}
