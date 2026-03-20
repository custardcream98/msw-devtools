import { type Metadata } from "next"

import { state } from "@/app/config"
import { Locales } from "@/locales/constants"
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
  params: Promise<{ locale: SubRouteLocales }>
}): Promise<Metadata> => {
  const { locale } = await params
  const dictionary = await getDictionary(locale)

  return {
    title: dictionary.title,
    description: dictionary.description,
    alternates: {
      canonical: `https://msw-devtools.shiwoo.dev/${locale}`,
      languages: Object.fromEntries(
        Locales.filter((l) => l !== locale).map((l) => [
          l,
          `https://msw-devtools.shiwoo.dev${l === "en" ? "" : `/${l}`}`
        ])
      )
    }
  }
}

const Layout = async ({
  children,
  params
}: React.PropsWithChildren<{
  params: Promise<{ locale: SubRouteLocales }>
}>) => {
  const { locale } = await params
  state.locale = locale
  return children
}

export default Layout
