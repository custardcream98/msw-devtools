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
  params: { locale: SubRouteLocales }
}): Promise<Metadata> => {
  const dictionary = await getDictionary(params.locale)

  return {
    title: dictionary.title,
    description: dictionary.description,
    alternates: {
      canonical: `https://msw-devtools.shiwoo.dev/${params.locale}`,
      languages: Object.fromEntries(
        Locales.filter((locale) => locale !== params.locale).map((locale) => [
          locale,
          `https://msw-devtools.shiwoo.dev${locale === "en" ? "" : `/${locale}`}`
        ])
      )
    }
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
