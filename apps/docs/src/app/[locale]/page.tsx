import type { SubRouteLocales } from "@/app/[locale]/layout"
import { Docs } from "@/components/server/Docs"

export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = (await params) as { locale: SubRouteLocales }
  return <Docs locale={locale} />
}
