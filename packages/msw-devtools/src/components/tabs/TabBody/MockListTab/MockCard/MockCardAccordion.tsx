import { clsx } from "clsx"
import type { JsonMock } from "core"
import { useTranslation } from "react-i18next"
import { FaChevronRight } from "react-icons/fa6"

import { useMockList } from "~/components/contexts/mock-list"
import { MethodPill } from "~/components/MethodPill"
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
  const { t } = useTranslation()

  const [isOpened, , , toggle] = useBoolean(isInitialOpen)
  const {
    activateMock,
    deactivateMock,
    activatePromptMode,
    deactivatePromptMode
  } = useMockList()

  return (
    <div className='rounded-2xl bg-white p-2 text-xs'>
      <div className='flex items-center'>
        <button
          className='mr-4 flex flex-wrap items-center gap-2 lg:flex-nowrap'
          onClick={toggle}
        >
          <FaChevronRight
            className={clsx(
              "transform-gpu text-gray-400 transition-transform duration-300",
              isOpened && "rotate-90"
            )}
          />

          <MethodPill method={jsonMock.method} />
          <StatusPill status={jsonMock.status} />
          <UrlText className='text-start'>{jsonMock.url}</UrlText>
        </button>
        <div className='ml-auto flex shrink-0 items-center gap-2'>
          <label className='flex items-center gap-1'>
            <span className='text-xs'>
              {t("tabs.mockList.mockCardAccordion.activate")}
            </span>
            <Toggle
              checked={jsonMock.isActivated}
              onChange={
                jsonMock.isActivated
                  ? () => deactivateMock(jsonMock)
                  : () => activateMock(jsonMock)
              }
            />
          </label>
          <label className='flex items-center gap-1'>
            <span className='text-xs'>
              {t("tabs.mockList.mockCardAccordion.prompt")}
            </span>
            <Toggle
              checked={jsonMock.shouldPromptResponse}
              onChange={
                jsonMock.shouldPromptResponse
                  ? () => deactivatePromptMode(jsonMock)
                  : () => activatePromptMode(jsonMock)
              }
            />
          </label>
        </div>
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
