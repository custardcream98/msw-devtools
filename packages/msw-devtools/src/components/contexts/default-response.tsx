import { StorageKey } from "~/constants"

import { createStorageContext } from "./createStorageContext"

const { Provider: DefaultResponseSettingsProvider, useValue } =
  createStorageContext(
    StorageKey.DEFAULT_RESPONSE,
    null,
    "DefaultResponseSettings"
  )

const useDefaultResponseSettings = () => {
  const [defaultResponse, setDefaultResponse] = useValue()
  return { defaultResponse, setDefaultResponse }
}

export { DefaultResponseSettingsProvider, useDefaultResponseSettings }
