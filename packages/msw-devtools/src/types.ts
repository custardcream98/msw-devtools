import type {
  FIELD_NAME,
  MethodOption,
  StatusOption
} from "~/components/tabs/TabBody/AddMockTab/AddMockForm"

export type JsonMock = {
  [FIELD_NAME.URL]: string
  [FIELD_NAME.METHOD]: MethodOption
  [FIELD_NAME.STATUS]: StatusOption
  [FIELD_NAME.RESPONSE]: object
}
