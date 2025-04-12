import { clsx } from "clsx"

export const UrlText = ({
  className,
  children
}: React.PropsWithChildren<{
  className?: string
}>) => {
  return (
    <code className={clsx(className, "min-w-0 text-wrap break-all !font-mono")}>
      {children}
    </code>
  )
}
