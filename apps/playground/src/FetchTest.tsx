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
    <div
      style={{
        width: "33%",
        padding: "1rem"
      }}
    >
      <span
        style={{
          display: "block"
        }}
      >
        URL:{" "}
      </span>
      <span
        style={{
          display: "block",
          fontFamily:
            "'Courier New', Courier, 'Lucida Console', 'Lucida Sans Typewriter', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Andale Mono', 'Nimbus Mono L', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          wordBreak: "break-all"
        }}
      >
        {targetUrl}
      </span>
      <button
        style={{
          marginTop: "1rem"
        }}
        type='button'
        onClick={() =>
          queryClient.resetQueries({
            queryKey: [targetUrl]
          })
        }
      >
        REFETCH
      </button>
      <div
        style={{
          marginTop: "1rem"
        }}
      >
        Response:{" "}
      </div>
      <pre
        style={{
          overflow: "auto"
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
