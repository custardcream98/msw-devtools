import { clsx } from "clsx"
import { FaChevronRight } from "react-icons/fa6"

import { CodeEditor } from "~/components/CodeEditor"
import {
  FIELD_NAME,
  METHOD_COLOR,
  STATUS_COLOR,
  STATUS_NAME
} from "~/constants"
import { useBoolean } from "~/hooks/useBoolean"
import type { JsonMock } from "~/types"

export const ActivatedMockCard = (props: JsonMock) => {
  const [isOpened, , , toggle] = useBoolean()

  return (
    <div className='rounded-2xl bg-white p-3 text-sm'>
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
            METHOD_COLOR[props[FIELD_NAME.METHOD]]
          )}
        >
          {props[FIELD_NAME.METHOD]}
        </span>
        <code className='mr-4 min-w-0 text-wrap break-all !font-mono'>
          {props[FIELD_NAME.URL]}
        </code>
        <span
          className={clsx(
            "ml-auto shrink-0 !font-mono font-semibold uppercase",
            STATUS_COLOR[props[FIELD_NAME.STATUS]]
          )}
        >
          {props[FIELD_NAME.STATUS]} {STATUS_NAME[props[FIELD_NAME.STATUS]]}
        </span>
      </div>
      <div
        className={clsx(
          "grid overflow-hidden transition-[grid-template-rows] duration-300",
          isOpened ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className='w-full overflow-hidden'>
          <CodeEditor
            className='mt-4'
            value={JSON.stringify(props[FIELD_NAME.RESPONSE], null, 2)}
            readOnly
          />
        </div>
      </div>
    </div>
  )
}
