import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary
} from "@tanstack/react-query"
import { ErrorBoundary } from "react-error-boundary"

import { ApiEndpointButton } from "./ApiEndpointButton"
import { ResponseDisplay, ResponseErrorDisplay } from "./ResponseDisplay"

const queryClient = new QueryClient()

function App() {
  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center gap-5 px-5 md:px-20'>
      <ApiEndpointButton />
      <QueryClientProvider client={queryClient}>
        <div className='relative w-full max-w-4xl'>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={ResponseErrorDisplay}
              >
                <ResponseDisplay />
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </div>
      </QueryClientProvider>
    </div>
  )
}

export default App
