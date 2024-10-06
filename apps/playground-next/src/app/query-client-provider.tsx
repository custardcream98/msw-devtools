"use client"

import { QueryClientProvider as _QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { getQueryClient } from "@/app/get-query-client"

const queryClient = getQueryClient()

export default function QueryClientProvider({
  children
}: React.PropsWithChildren) {
  return (
    <_QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </_QueryClientProvider>
  )
}
