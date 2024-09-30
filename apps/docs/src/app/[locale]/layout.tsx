import { getDictionary } from "@/locales/dictionaries"
import { type Metadata } from "next"
import type { RoutePageProps, SubRouteLocales } from "@/app/[locale]/types"
import { state } from "@/app/config"

export async function generateStaticParams(): Promise<
  { locale: SubRouteLocales }[]
> {
  return [{ locale: "ko" }]
}

export const generateMetadata = async ({
  params
}: RoutePageProps): Promise<Metadata> => {
  const dictionary = await getDictionary(params.locale)

  return {
    title: dictionary.title
    // description: dictionary.description
  }
}

const Layout = ({
  children,
  params: { locale }
}: React.PropsWithChildren<RoutePageProps>) => {
  state.locale = locale
  return children
}

export default Layout
