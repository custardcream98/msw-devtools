import { useCallback } from "react"
import { useTranslation } from "react-i18next"

import type { Language } from "~/lib/i18n"

export const MSW_DEVTOOLS_LANG = "MSW_DEVTOOLS_LANG"

export const useLanguage = () => {
  const { i18n } = useTranslation()
  const language = i18n.language as Language

  const setLanguage = useCallback(
    (lang: Language) => {
      i18n.changeLanguage(lang)
      localStorage.setItem(MSW_DEVTOOLS_LANG, lang)
    },
    [i18n]
  )

  return {
    setLanguage,
    language
  }
}
