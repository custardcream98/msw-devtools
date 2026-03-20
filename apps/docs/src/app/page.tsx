import type { RoutePageProps } from "@/app/types"
import { Docs } from "@/components/server/Docs"

export default async function Page({ params }: RoutePageProps) {
  const { locale = "en" } = await params
  return <Docs locale={locale} />
}
