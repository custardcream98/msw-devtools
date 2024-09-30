import { type Metadata } from "next"

import { state } from "@/app/config"
import type { Locales } from "@/locales/constants"
import { getDictionary } from "@/locales/dictionaries"

export type SubRouteLocales = Exclude<Locales, "en">

export async function generateStaticParams(): Promise<
  { locale: SubRouteLocales }[]
> {
  return [{ locale: "ko" }]
}

export const generateMetadata = async ({
  params
}: {
  params: { locale: SubRouteLocales }
}): Promise<Metadata> => {
  const dictionary = await getDictionary(params.locale)

  return {
    title: dictionary.title,
    description: dictionary.description
  }
}

const Layout = ({
  children,
  params: { locale }
}: React.PropsWithChildren<{
  params: { locale: SubRouteLocales }
}>) => {
  state.locale = locale
  return children
}

export default Layout
