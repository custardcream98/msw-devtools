import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"

import { getQueryClient } from "@/app/get-query-client"
import FetchTest from "@/components/FetchTest"

export default function Home() {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ["https://api.sampleapis.com/switch/games"],
    queryFn: async () => {
      const response = await fetch("https://api.sampleapis.com/switch/games")
      return await response.json()
    }
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback='loading'>
        <FetchTest targetUrl='https://api.sampleapis.com/switch/games' />
      </Suspense>
    </HydrationBoundary>
  )
}
