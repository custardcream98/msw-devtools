import { BasicSetupOptions } from "@uiw/react-codemirror"

import { CodeEditor } from "~/components/CodeEditor"
import { FIELD_NAME } from "~/constants"
import type { JsonMock } from "~/types"

import { ActivatedMockCardAccordion } from "./ActivatedMockCardAccordion"

const CODE_EDITOR_BASIC_SETUP_OPTIONS: BasicSetupOptions = {
  highlightActiveLine: false
}

export const ActivatedMockCard = (jsonMock: JsonMock) => {
  return (
    <ActivatedMockCardAccordion {...jsonMock}>
      <CodeEditor
        className='mt-4'
        value={JSON.stringify(jsonMock[FIELD_NAME.RESPONSE], null, 2)}
        basicSetup={CODE_EDITOR_BASIC_SETUP_OPTIONS}
        minHeight='auto'
        readOnly
      />
    </ActivatedMockCardAccordion>
  )
}
