import { clsx } from "clsx"

export const ScrollList = ({
  className,
  children
}: React.PropsWithChildren<{
  className?: string
}>) => {
  return (
    <div className={clsx(className, "relative h-full min-h-0")}>
      <div className='h-full overflow-auto p-3'>{children}</div>
    </div>
  )
}
