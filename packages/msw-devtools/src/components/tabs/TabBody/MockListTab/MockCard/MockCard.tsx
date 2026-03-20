import { BasicSetupOptions } from "@uiw/react-codemirror"
import { type JsonMock, JsonMockResponseType } from "core"
import { useTranslation } from "react-i18next"
import { FaRegTrashCan } from "react-icons/fa6"
import { HiMiniPencilSquare } from "react-icons/hi2"

import { CodeEditor } from "~/components/CodeEditor"
import { useEditState } from "~/components/contexts/edit-state"
import { useMockList } from "~/components/contexts/mock-list"
import { ResponseIndexBadge } from "~/components/ResponseIndexBadge"
import { useTab } from "~/components/tabs/TabBar"
import { Tab } from "~/constants"
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
  const { removeMock } = useMockList()
  const { setEditState } = useEditState()

  const { t } = useTranslation()

  const { response } = jsonMock

  return (
    <MockCardAccordion isInitialOpen={isInitialOpen} {...jsonMock}>
      <div className='flex flex-1 gap-2 overflow-auto'>
        {response.type === JsonMockResponseType.single ? (
          <CodeEditor
            className='mt-3 w-full'
            value={JSON.stringify(response.response, null, 2)}
            basicSetup={CODE_EDITOR_BASIC_SETUP_OPTIONS}
            minHeight='auto'
            readOnly
          />
        ) : (
          response.response.map((response, index) => (
            <div key={index} className='mt-3 w-full'>
              <ResponseIndexBadge index={index} />
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
      <div className='mt-2 flex items-center gap-2'>
        {!!jsonMock.responseDelay && (
          <span className='font-mono! text-[0.65rem] text-slate-400'>
            {t("mockListTab.mockCard.responseDelay", {
              delay: jsonMock.responseDelay
            })}
          </span>
        )}
        <button
          className='ml-auto rounded p-1 transition-colors hover:bg-slate-100'
          type='button'
          onClick={() => {
            setEditState(jsonMockToFormFieldValues(jsonMock))
            setTab(Tab.AddMock)
          }}
        >
          <HiMiniPencilSquare size={14} className='text-slate-400' />
        </button>
        <button
          className='rounded p-1 transition-colors hover:bg-slate-100'
          type='button'
          onClick={() => {
            removeMock(jsonMock)
          }}
        >
          <FaRegTrashCan size={14} className='text-slate-400' />
        </button>
      </div>
    </MockCardAccordion>
  )
}
