import { clsx } from "clsx"
import { FaChevronRight } from "react-icons/fa6"

import { CodeEditor } from "~/components/CodeEditor"
import { FIELD_NAME, METHOD_COLOR } from "~/constants"
import { useBoolean } from "~/hooks/useBoolean"
import type { JsonMock } from "~/types"

export const ActivatedMockCard = (props: JsonMock) => {
  const [isOpened, , , toggle] = useBoolean()

  return (
    <div className='rounded-2xl bg-white p-4'>
      <button
        type='button'
        className='flex w-full items-center'
        onClick={toggle}
      >
        <FaChevronRight
          className={clsx(
            "mr-4 transform-gpu transition-transform duration-300",
            isOpened && "rotate-90"
          )}
        />
        <code
          className={clsx(
            "mr-2 font-mono font-semibold uppercase",
            METHOD_COLOR[props[FIELD_NAME.METHOD]]
          )}
        >
          {props[FIELD_NAME.METHOD]}
        </code>
        <code className='font-mono'>{props[FIELD_NAME.URL]}</code>
      </button>
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
