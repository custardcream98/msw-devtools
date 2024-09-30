export const Locales = ["en", "ko"] as const

export type Locales = (typeof Locales)[number]
