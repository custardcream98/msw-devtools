import type { RoutePageProps } from "@/app/types"
import { Docs } from "@/components/server/Docs"

export default async function Page({
  params: { locale = "en" } = {}
}: RoutePageProps) {
  return <Docs locale={locale} />
}
