import type { Metadata } from "next"
import "./globals.css"
import { getDictionary } from "@/locales/dictionaries"

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
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
