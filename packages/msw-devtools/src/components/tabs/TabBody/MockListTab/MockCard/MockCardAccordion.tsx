import type { JsonMock } from "@custardcream/msw-devtools-core"
import { clsx } from "clsx"
import { FaChevronRight } from "react-icons/fa6"

import { useMockList } from "~/components/contexts/mock-list"
import { Toggle } from "~/components/Toggle"
import { METHOD_COLOR, STATUS_COLOR, STATUS_NAME } from "~/constants"
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
        <button className='mr-2 shrink-0 pr-1' onClick={toggle}>
          <FaChevronRight
            className={clsx(
              "transform-gpu text-gray-400 transition-transform duration-300",
              isOpened && "rotate-90"
            )}
          />
        </button>
        <span
          className={clsx(
            "mr-2 !font-mono font-semibold uppercase",
            METHOD_COLOR[jsonMock.method]
          )}
        >
          {jsonMock.method}
        </span>
        <span
          className={clsx(
            "mr-2 shrink-0 rounded-lg bg-slate-100 px-[0.3rem] py-[0.125rem] !font-mono text-[0.7rem] font-semibold uppercase",
            STATUS_COLOR[jsonMock.status]
          )}
        >
          {jsonMock.status} {STATUS_NAME[jsonMock.status]}
        </span>
        <code className='mr-4 min-w-0 text-wrap break-all !font-mono'>
          {jsonMock.url}
        </code>
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
