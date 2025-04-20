import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { Suspense } from "react"
import { FallbackProps } from "react-error-boundary"

import { JsonHighlighter } from "./JsonHighlighter"
import { query } from "./queryOptions"
import { ReloadButton } from "./ReloadButton"

export const ResponseDisplay = () => {
  const queryClient = useQueryClient()

  return (
    <div className='w-full max-w-4xl'>
      <h2 className='flex items-center rounded-t-lg bg-gray-700 px-2 py-1 font-mono font-bold'>
        Response
        <Suspense>
          <SuspendedResponseStatusDisplay className='ml-2' />
        </Suspense>
        <ReloadButton
          className='ml-auto'
          onClick={() =>
            queryClient.resetQueries({
              queryKey: query.custardStatus().queryKey
            })
          }
        >
          Reload
        </ReloadButton>
      </h2>
      <div className='overflow-hidden rounded-b-lg'>
        <Suspense fallback={<JsonHighlighter>loading...</JsonHighlighter>}>
          <SuspendedDisplay />
        </Suspense>
      </div>
    </div>
  )
}

export const ResponseErrorDisplay = ({
  error,
  resetErrorBoundary
}: FallbackProps) => {
  return (
    <div className='w-full max-w-4xl'>
      <h2 className='flex items-center rounded-t-lg bg-gray-700 px-2 py-1 font-mono font-bold'>
        Response
        <ResponseStatusDisplay className='ml-2' status={error.status} />
        <ReloadButton className='ml-auto' onClick={resetErrorBoundary}>
          Reset
        </ReloadButton>
      </h2>
      <div className='overflow-hidden rounded-b-lg'>
        <JsonHighlighter>
          {JSON.stringify(error.response, null, 2)}
        </JsonHighlighter>
      </div>
    </div>
  )
}

const SuspendedResponseStatusDisplay = ({
  className
}: {
  className?: string
}) => {
  const { data } = useSuspenseQuery(query.custardStatus())

  return <ResponseStatusDisplay className={className} status={data.status} />
}

const ResponseStatusDisplay = ({
  status,
  className
}: {
  status: number
  className?: string
}) => {
  const color = status < 400 ? "text-green-500" : "text-red-500"

  return <span className={clsx(color, className)}>{status}</span>
}

const SuspendedDisplay = () => {
  const {
    data: { response }
  } = useSuspenseQuery(query.custardStatus())

  return <JsonHighlighter>{JSON.stringify(response, null, 2)}</JsonHighlighter>
}
