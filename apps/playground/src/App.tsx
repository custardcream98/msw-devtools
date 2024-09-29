import "./reset.css"

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
        React.js Demo
      </h3>
      <p
        style={{
          lineHeight: "1.5",
          width: "100%"
        }}
      >
        Try adding mock request handler of APIs below and click{" "}
        <code>REFETCH</code> button to see the request gets mocked.
      </p>
      <QueryClientProvider client={queryClient}>
        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto"
          }}
        >
          <QuerySuspenseBoundary>
            <FetchTest targetUrl='https://api.sampleapis.com/switch/games' />
          </QuerySuspenseBoundary>
          <QuerySuspenseBoundary>
            <FetchTest targetUrl='https://api.sampleapis.com/recipes/recipes' />
          </QuerySuspenseBoundary>
          <QuerySuspenseBoundary>
            <FetchTest targetUrl='https://api.sampleapis.com/wines/reds' />
          </QuerySuspenseBoundary>
        </div>
      </QueryClientProvider>
    </>
  )
}

export default App
