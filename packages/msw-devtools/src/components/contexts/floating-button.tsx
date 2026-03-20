import { StorageKey } from "~/constants"

import { createStorageContext } from "./createStorageContext"

const {
  Context: FloatingButtonSettingsContext,
  Provider: FloatingButtonSettingsProvider,
  useValue
} = createStorageContext(
  StorageKey.FLOATING_BUTTON_OPACITY,
  1,
  "FloatingButtonSettings"
)

const useFloatingButtonSettings = () => {
  const [floatingButtonOpacity, setFloatingButtonOpacity] = useValue()
  return { floatingButtonOpacity, setFloatingButtonOpacity }
}

export {
  FloatingButtonSettingsContext,
  FloatingButtonSettingsProvider,
  useFloatingButtonSettings
}
