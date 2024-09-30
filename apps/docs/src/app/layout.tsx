import type { Metadata } from "next"
import "./globals.css"
import { getDictionary } from "@/locales/dictionaries"
import { state } from "@/app/config"
import { pretendard } from "@/fonts"

export const generateMetadata = async (): Promise<Metadata> => {
  const dictionary = await getDictionary("en")

  return {
    title: dictionary.title
    // description: dictionary.description
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
        {children}
      </body>
    </html>
  )
}
