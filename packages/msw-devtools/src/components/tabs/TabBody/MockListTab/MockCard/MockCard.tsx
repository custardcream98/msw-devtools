import { BasicSetupOptions } from "@uiw/react-codemirror"
import { FaRegTrashCan } from "react-icons/fa6"
import { HiMiniPencilSquare } from "react-icons/hi2"

import { CodeEditor } from "~/components/CodeEditor"
import { useMockList } from "~/components/contexts/mock-list"
import { Tab, useTab } from "~/components/tabs/TabBar"
import { FIELD_NAME, FormFieldValues } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import type { JsonMock } from "~/types"

import { MockCardAccordion } from "./MockCardAccordion"

const CODE_EDITOR_BASIC_SETUP_OPTIONS: BasicSetupOptions = {
  highlightActiveLine: false
}

export const MockCard = (jsonMock: JsonMock) => {
  const { setTab } = useTab()
  const [, setEditStateLocal] = useLocalStorageState<FormFieldValues | null>(
    "EDIT_STATE",
    null
  )

  const { removeMock } = useMockList()

  return (
    <MockCardAccordion {...jsonMock}>
      <CodeEditor
        className='mt-4'
        value={JSON.stringify(jsonMock[FIELD_NAME.RESPONSE], null, 2)}
        basicSetup={CODE_EDITOR_BASIC_SETUP_OPTIONS}
        minHeight='auto'
        readOnly
      />
      <div className='mt-2 flex items-center gap-3'>
        <button
          className='ml-auto'
          type='button'
          onClick={() => {
            setEditStateLocal({
              [FIELD_NAME.URL]: jsonMock[FIELD_NAME.URL],
              [FIELD_NAME.METHOD]: jsonMock[FIELD_NAME.METHOD],
              [FIELD_NAME.STATUS]: jsonMock[FIELD_NAME.STATUS],
              [FIELD_NAME.RESPONSE]: JSON.stringify(
                jsonMock[FIELD_NAME.RESPONSE],
                null,
                2
              )
            })
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