import "./globals.css"

import type { Metadata } from "next"

import { state } from "@/app/config"
import { LanguageSelector } from "@/components/client/LanguageSelector"
import { pretendard } from "@/fonts"
import { getDictionary } from "@/locales/dictionaries"

export const generateMetadata = async (): Promise<Metadata> => {
  const dictionary = await getDictionary("en")

  return {
    title: dictionary.title,
    description: dictionary.description
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={state.locale}>
      <body
        className={`bg-background text-foreground ${pretendard.variable} font-pretendard`}
      >
        <aside className='fixed right-2 top-2'>
          <LanguageSelector />
        </aside>
        {children}
      </body>
    </html>
  )
}
