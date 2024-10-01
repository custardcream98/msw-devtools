import { BasicSetupOptions } from "@uiw/react-codemirror"
import { useTranslation } from "react-i18next"
import { FaRegTrashCan } from "react-icons/fa6"
import { HiMiniPencilSquare } from "react-icons/hi2"

import { CodeEditor } from "~/components/CodeEditor"
import { useMockList } from "~/components/contexts/mock-list"
import { useTab } from "~/components/tabs/TabBar"
import { FIELD_NAME, StorageKey, Tab } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import type { JsonMock } from "~/types"
import { jsonMockToFormFieldValues } from "~/utils/jsonMockToFormFieldValues"

import { MockCardAccordion } from "./MockCardAccordion"

const CODE_EDITOR_BASIC_SETUP_OPTIONS: BasicSetupOptions = {
  highlightActiveLine: false
}

export const MockCard = ({
  isInitialOpen,
  ...jsonMock
}: JsonMock & {
  isInitialOpen?: boolean
}) => {
  const { setTab } = useTab()
  const [, setEditStateLocal] = useLocalStorageState(
    StorageKey.EDIT_STATE,
    null
  )

  const { t } = useTranslation()

  const { removeMock } = useMockList()

  const response = jsonMock[FIELD_NAME.RESPONSE]

  return (
    <MockCardAccordion isInitialOpen={isInitialOpen} {...jsonMock}>
      <div className='flex flex-1 gap-2 overflow-auto'>
        {response.type === "single" ? (
          <CodeEditor
            className='mt-4 w-full'
            value={JSON.stringify(response.response, null, 2)}
            basicSetup={CODE_EDITOR_BASIC_SETUP_OPTIONS}
            minHeight='auto'
            readOnly
          />
        ) : (
          response.response.map((response, index) => (
            <div key={index} className='mt-4 w-full'>
              <div className="mb-2 flex items-center gap-2 after:h-[2px] after:w-full after:bg-slate-300 after:content-['']">
                <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-solid border-slate-400 text-xs text-slate-400'>
                  {index + 1}
                </span>
              </div>
              <CodeEditor
                className='min-w-[400px]'
                value={JSON.stringify(response, null, 2)}
                basicSetup={CODE_EDITOR_BASIC_SETUP_OPTIONS}
                minHeight='auto'
                readOnly
              />
            </div>
          ))
        )}
      </div>
      <div className='mt-2 flex items-center gap-3'>
        {!!jsonMock[FIELD_NAME.RESPONSE_DELAY] && (
          <span className='font-mono! text-xs text-gray-500'>
            {t("mockListTab.mockCard.responseDelay", {
              delay: jsonMock[FIELD_NAME.RESPONSE_DELAY]
            })}
          </span>
        )}
        <button
          className='ml-auto'
          type='button'
          onClick={() => {
            setEditStateLocal(jsonMockToFormFieldValues(jsonMock))
            setTab(Tab.AddMock)
          }}
        >
          <HiMiniPencilSquare size={15} className='text-gray-400' />
        </button>
        <button
          className='mr-2'
          type='button'
          onClick={() => {
            removeMock(jsonMock)
          }}
        >
          <FaRegTrashCan size={15} className='text-gray-400' />
        </button>
      </div>
    </MockCardAccordion>
  )
}
