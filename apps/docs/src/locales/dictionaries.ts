import "server-only"

export const Locales = ["en", "ko"] as const

export type Locales = (typeof Locales)[number]

const dictionaries = {
  en: () => import("./en/common.json"),
  ko: () => import("./ko/common.json")
}

export const getDictionary = (locale: Locales) => dictionaries[locale]()
