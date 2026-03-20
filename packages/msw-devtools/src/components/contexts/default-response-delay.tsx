import { StorageKey } from "~/constants"

import { createStorageContext } from "./createStorageContext"

const { Provider: DefaultResponseDelaySettingsProvider, useValue } =
  createStorageContext(
    StorageKey.RESPONSE_DELAY,
    0.5,
    "DefaultResponseDelaySettings"
  )

const useDefaultResponseDelaySettings = () => {
  const [defaultResponseDelay, setDefaultResponseDelay] = useValue()
  return { defaultResponseDelay, setDefaultResponseDelay }
}

export { DefaultResponseDelaySettingsProvider, useDefaultResponseDelaySettings }
