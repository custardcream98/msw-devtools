import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import { MSW_DEVTOOLS_LANG } from "~/hooks/useLanguage"
import en from "~/locales/en"
import ko from "~/locales/ko"

export const LANGUAGE = {
  EN: "en",
  KO: "ko"
} as const

export type Language = (typeof LANGUAGE)[keyof typeof LANGUAGE]

export const LANGUAGE_NAMES = {
  [LANGUAGE.EN]: "English",
  [LANGUAGE.KO]: "한국어"
} as const

const initializeI18n = () =>
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: LANGUAGE.EN,
      interpolation: {
        escapeValue: false
      },
      resources: {
        [LANGUAGE.EN]: en,
        [LANGUAGE.KO]: ko
      },
      defaultNS: "common",
      detection: {
        order: ["localStorage", "navigator"],
        lookupLocalStorage: MSW_DEVTOOLS_LANG,
        caches: ["localStorage"],
        convertDetectedLanguage(language) {
          if (language === "ko-KR" || language === "ko") {
            return LANGUAGE.KO
          }

          return LANGUAGE.EN
        }
      }
    })

export default initializeI18n
