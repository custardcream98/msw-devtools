import type { Locales } from "./constants"

export type SubRouteLocales = Exclude<Locales, "en">

const SUB_ROUTE_LOCALES: SubRouteLocales[] = ["ko"]

export function isSubRouteLocale(locale: string): locale is SubRouteLocales {
  return (SUB_ROUTE_LOCALES as string[]).includes(locale)
}

export { SUB_ROUTE_LOCALES }
