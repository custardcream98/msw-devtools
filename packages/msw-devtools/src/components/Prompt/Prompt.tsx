import { type JsonMock } from "core"

import { Backdrop } from "./Backdrop"

export const Prompt = ({
  jsonMock,
  onSubmit
}: {
  jsonMock: JsonMock
  onSubmit: (response: string) => void
}) => {
  return (
    <Backdrop>
      <div className='w-10/12 rounded-lg bg-white p-5'>
        {JSON.stringify(jsonMock, null, 2)}
      </div>
      <button type='button' onClick={() => onSubmit("test")}></button>
    </Backdrop>
  )
}
