import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import FetchTest from "./FetchTest"
import { QuerySuspenseBoundary } from "./QuerySuspenseBoundary"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QuerySuspenseBoundary>
        <FetchTest />
      </QuerySuspenseBoundary>
    </QueryClientProvider>
  )
}

export default App
