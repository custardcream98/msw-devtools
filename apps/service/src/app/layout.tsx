import "sample-react-package/dist/esm/index.css"
import "./globals.css"

import { pretendard } from "@/assets/fonts"
import { Metadata } from "next"

export const metadata: Metadata = {
  description: "한국어 타자 연습",
  title: "HanType"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ko'>
      <body className={pretendard.className}>{children}</body>
    </html>
  )
}
