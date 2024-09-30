import "server-only"

import type { Locales } from "@/locales/constants"

const dictionaries = {
  en: () => import("./en/common.json"),
  ko: () => import("./ko/common.json")
}

export const getDictionary = (locale: Locales) => dictionaries[locale]()
