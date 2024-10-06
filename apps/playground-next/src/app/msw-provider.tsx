"use client"

import { Suspense, use } from "react"

const mockingEnabledPromise =
  typeof window !== "undefined"
    ? import("@/mock/browser").then(({ start }) => start())
    : Promise.resolve()

export default function MSWProvider({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  if (process.env.NODE_ENV === "production") {
    return children
  }

  return (
    <Suspense fallback={null}>
      <MSWProviderWrapper>{children}</MSWProviderWrapper>
    </Suspense>
  )
}

function MSWProviderWrapper({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  use(mockingEnabledPromise)
  return children
}
