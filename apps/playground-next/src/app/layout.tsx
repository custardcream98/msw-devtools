import "./globals.css"
import "@/mock/server"

import { type Metadata } from "next"

import MSWProvider from "@/app/msw-provider"
import QueryClientProvider from "@/app/query-client-provider"

export const metadata: Metadata = {
  title: "MSW Devtools Next.js Playground"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        <MSWProvider>
          <QueryClientProvider>{children}</QueryClientProvider>
        </MSWProvider>
      </body>
    </html>
  )
}
