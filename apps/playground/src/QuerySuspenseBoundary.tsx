import { QueryErrorResetBoundary } from "@tanstack/react-query"
import React from "react"

export const QuerySuspenseBoundary = ({
  children
}: React.PropsWithChildren) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <React.Suspense
          fallback={
            <div
              style={{
                width: "33%"
              }}
            >
              <button onClick={reset}>Reset</button>
              <div>Loading...</div>
            </div>
          }
        >
          {children}
        </React.Suspense>
      )}
    </QueryErrorResetBoundary>
  )
}
