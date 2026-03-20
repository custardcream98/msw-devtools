import { notFound } from "next/navigation"

import { Docs } from "@/components/server/Docs"
import { isSubRouteLocale } from "@/locales/guards"

export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isSubRouteLocale(locale)) notFound()

  return <Docs locale={locale} />
}
