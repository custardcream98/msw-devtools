import {
  type JsonMockResponseType,
  type MethodOption,
  type StatusOption
} from "core"

export type FormFieldResponseValue =
  | {
      type: typeof JsonMockResponseType.single
      response: string
    }
  | {
      type: typeof JsonMockResponseType.sequential
      response: string[]
    }

export type FormFieldValues = {
  url: string
  method: MethodOption
  status: StatusOption
  response: FormFieldResponseValue
  responseDelay: number
  isActivated: boolean
  shouldPromptResponse: boolean
}
