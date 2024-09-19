import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"

type SwitchGame = {
  id: string
  name: string
  genre: string[]
  developers: string[]
  publishers: string[]
  releaseDates: {
    Japan: string
    NorthAmerica: string
    Europe: string
    Australia: string
  }
}

export default function FetchTest() {
  const queryClient = useQueryClient()
  const { data } = useSuspenseQuery<SwitchGame[]>({
    queryKey: ["test"],
    queryFn: async () => {
      const response = await fetch("https://api.sampleapis.com/switch/games")
      return await response.json()
    }
  })

  return (
    <div>
      <button
        type='button'
        onClick={() =>
          queryClient.resetQueries({
            queryKey: ["test"]
          })
        }
      >
        REFETCH
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
