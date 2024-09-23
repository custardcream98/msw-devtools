import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import FetchTest from "./FetchTest"
import { QuerySuspenseBoundary } from "./QuerySuspenseBoundary"

const queryClient = new QueryClient()

function App() {
  return (
    <>
      <h3>
        <a
          href='https://www.npmjs.com/package/@custardcream/msw-devtools'
          target='_blank'
          rel='noreferrer'
        >
          @custardcream/msw-devtools
        </a>{" "}
        Demo
      </h3>
      <p
        style={{
          lineHeight: "1.5"
        }}
      >
        Try adding mock request handler of
        <code style={{ display: "block" }}>
          https://api.sampleapis.com/switch/games
        </code>
        and click <code>REFETCH</code> button to see the request gets mocked.
      </p>
      <QueryClientProvider client={queryClient}>
        <QuerySuspenseBoundary>
          <FetchTest />
        </QuerySuspenseBoundary>
      </QueryClientProvider>
    </>
  )
}

export default App
