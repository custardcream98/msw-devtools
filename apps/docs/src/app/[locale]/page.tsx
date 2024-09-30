import type { RoutePageProps } from "@/app/[locale]/types"
import { type NextPage } from "next"

const Page: NextPage<RoutePageProps> = async ({ params: { locale } }) => {
  return <div>locale: {locale}</div>
}

export default Page
