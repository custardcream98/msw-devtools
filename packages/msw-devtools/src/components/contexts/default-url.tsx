import { StorageKey } from "~/constants"

import { createStorageContext } from "./createStorageContext"

const { Provider: DefaultUrlSettingsProvider, useValue } = createStorageContext(
  StorageKey.DEFAULT_URL,
  null,
  "DefaultUrlSettings"
)

const useDefaultUrlSettings = () => {
  const [defaultUrl, setDefaultUrl] = useValue()
  return { defaultUrl, setDefaultUrl }
}

export { DefaultUrlSettingsProvider, useDefaultUrlSettings }
