import type { Locales } from "@/locales/constants"

export type RoutePageProps = {
  params: Promise<{
    locale?: Locales
  }>
}
