import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import en from "~/locales/en"
import ko from "~/locales/ko"

export const initializeI18n = () =>
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "en",
      interpolation: {
        escapeValue: false
      },
      resources: {
        en,
        ko
      },
      defaultNS: "common"
    })
