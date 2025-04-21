import { clsx } from "clsx"
import type { JsonMock } from "core"
import { FaChevronRight } from "react-icons/fa6"

import { useMockList } from "~/components/contexts/mock-list"
import { MethodPill } from "~/components/MethodPill"
import { PromptModePill } from "~/components/PromptModePill"
import { StatusPill } from "~/components/StatusPill"
import { Toggle } from "~/components/Toggle"
import { UrlText } from "~/components/UrlText"
import { useBoolean } from "~/hooks/useBoolean"

export const MockCardAccordion = ({
  children,
  isInitialOpen,
  ...jsonMock
}: React.PropsWithChildren<
  JsonMock & {
    isInitialOpen?: boolean
  }
>) => {
  const [isOpened, , , toggle] = useBoolean(isInitialOpen)
  const { activateMock, deactivateMock } = useMockList()

  return (
    <div className='rounded-2xl bg-white p-2 text-xs'>
      <div className='flex w-full items-center'>
        <button className='mr-4 flex shrink-0 items-center' onClick={toggle}>
          <FaChevronRight
            className={clsx(
              "mr-3",
              "transform-gpu text-gray-400 transition-transform duration-300",
              isOpened && "rotate-90"
            )}
          />

          <MethodPill className='mr-2' method={jsonMock.method} />
          <StatusPill className='mr-2' status={jsonMock.status} />
          <PromptModePill
            className='mr-2'
            isPromptModeActivated={jsonMock.shouldPromptResponse}
          />
          <UrlText>{jsonMock.url}</UrlText>
        </button>
        <Toggle
          className='ml-auto'
          value={jsonMock.isActivated}
          onChange={
            jsonMock.isActivated
              ? () => deactivateMock(jsonMock)
              : () => activateMock(jsonMock)
          }
        />
      </div>
      <div
        className={clsx(
          "grid overflow-hidden transition-[grid-template-rows] duration-300",
          isOpened ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className='w-full overflow-hidden'>{children}</div>
      </div>
    </div>
  )
}
