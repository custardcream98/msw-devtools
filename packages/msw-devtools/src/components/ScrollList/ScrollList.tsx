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
        "msw-d-relative msw-d-h-full msw-d-min-h-0",
        "after:msw-d-absolute after:msw-d-left-0 after:msw-d-right-0 after:msw-d-top-0 after:msw-d-h-5 after:msw-d-bg-gradient-to-b after:msw-d-from-gray-300 after:msw-d-bg-[length:100%_20px] after:msw-d-bg-left-top after:msw-d-bg-no-repeat after:msw-d-transition-opacity after:msw-d-content-['']",
        isScrolled ? "after:msw-d-opacity-1" : "after:msw-d-opacity-0"
      )}
    >
      <div className='msw-d-h-full msw-d-overflow-auto msw-d-p-3'>
        <div ref={intersectionSensorRef}></div>
        {children}
      </div>
    </div>
  )
}
