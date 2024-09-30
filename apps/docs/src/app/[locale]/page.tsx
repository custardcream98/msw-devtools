import type { SubRouteLocales } from "@/app/[locale]/layout"
import { Docs } from "@/components/server/Docs"

export default async function Page({
  params: { locale }
}: {
  params: { locale: SubRouteLocales }
}) {
  return <Docs locale={locale} />
}
