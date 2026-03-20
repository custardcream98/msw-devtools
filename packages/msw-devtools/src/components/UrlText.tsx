import { clsx } from "clsx"

export const UrlText = ({
  className,
  children
}: React.PropsWithChildren<{
  className?: string
}>) => {
  return (
    <code
      className={clsx(className, "min-w-0 truncate !font-mono text-slate-700")}
    >
      {children}
    </code>
  )
}
