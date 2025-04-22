import { useIsFetching } from "@tanstack/react-query"
import clsx from "clsx"

export const ReloadButton = ({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const isFetching = !!useIsFetching()

  return (
    <button
      type='button'
      className={clsx(
        "cursor-pointer rounded-xl bg-gray-600 px-3 py-1 text-sm",
        "transition-all duration-300",
        "hover:[:not(:disabled)]:bg-gray-900",
        "disabled:cursor-progress disabled:opacity-50",
        className
      )}
      disabled={isFetching}
      {...props}
    >
      {children}
    </button>
  )
}
