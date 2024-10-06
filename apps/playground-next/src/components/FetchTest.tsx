"use client"

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"

export default function FetchTest({ targetUrl }: { targetUrl: string }) {
  const queryClient = useQueryClient()
  const { data } = useSuspenseQuery({
    queryKey: [targetUrl],
    queryFn: async () => {
      const response = await fetch(targetUrl)
      return await response.json()
    }
  })

  return (
    <div className='w-1/3 p-4'>
      <span className='block'>URL: </span>
      <span
        className='block break-all'
        style={{
          fontFamily:
            "'Courier New', Courier, 'Lucida Console', 'Lucida Sans Typewriter', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Andale Mono', 'Nimbus Mono L', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        }}
      >
        {targetUrl}
      </span>
      <button
        className='mt-4'
        type='button'
        onClick={() =>
          queryClient.resetQueries({
            queryKey: [targetUrl]
          })
        }
      >
        REFETCH
      </button>
      <div className='mt-4'>Response: </div>
      <pre className='overflow-auto'>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
