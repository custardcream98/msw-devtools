import { clsx } from "clsx"
import { useRef } from "react"

import { useIsIntersecting } from "~/hooks/useIsIntersecting"

export const ScrollList = ({
  className,
  children
}: React.PropsWithChildren<{
  className?: string
}>) => {
  const intersectionSensorRef = useRef<HTMLDivElement>(null)
  const isScrolled = !useIsIntersecting(intersectionSensorRef)

  return (
    <div
      className={clsx(
        className,
        "relative h-full min-h-0",
        "after:absolute after:left-0 after:right-0 after:top-0 after:h-5 after:bg-gradient-to-b after:from-gray-300 after:bg-[length:100%_20px] after:bg-left-top after:bg-no-repeat after:transition-opacity after:content-['']",
        isScrolled ? "after:opacity-1" : "after:opacity-0"
      )}
    >
      <div className='h-full overflow-auto p-3'>
        <div ref={intersectionSensorRef}></div>
        {children}
      </div>
    </div>
  )
}
