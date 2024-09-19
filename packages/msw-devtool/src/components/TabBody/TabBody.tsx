import { clsx } from "clsx"
import { useRef } from "react"

import { Tab, useTab } from "~/components/TabBar/context"
import { AddMockTab } from "~/components/TabBody/AddMockTab"
import { useIsIntersecting } from "~/hooks/useIsIntersecting"

export const TabBody = () => {
  const { tab } = useTab()

  const intersectionSensorRef = useRef<HTMLDivElement>(null)
  const isScrolled = !useIsIntersecting(intersectionSensorRef)

  return (
    <div
      className={clsx(
        "msw-d-h-full msw-d-overflow-auto msw-d-p-3",
        isScrolled &&
          "after:msw-d-absolute after:msw-d-left-0 after:msw-d-right-0 after:msw-d-top-0 after:msw-d-h-5 after:msw-d-bg-gradient-to-b after:msw-d-from-gray-300 after:msw-d-bg-[length:100%_20px] after:msw-d-bg-left-top after:msw-d-bg-no-repeat after:msw-d-content-['']"
      )}
    >
      <div ref={intersectionSensorRef}></div>
      {tab === Tab.AddMock && <AddMockTab />}
    </div>
  )
}
