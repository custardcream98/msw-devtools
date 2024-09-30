import { Locales } from "@/locales/dictionaries"

export type SubRouteLocales = Exclude<Locales, "en">

export type RoutePageProps = {
  params: {
    locale: SubRouteLocales
  }
}
