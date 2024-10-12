import { generateHandler } from "core"
import type { HttpHandler } from "msw"
import type { SetupServerApi } from "msw/node"

import { readMockListFile, watchMockListFile } from "~/file"

export const register = ({ server }: { server: SetupServerApi }) => {
  watchMockListFile("mockList.json", (mockList) => {
    server.resetHandlers(...mockList.map(generateHandler))
  })
}

export const getInitialHandlers = (): HttpHandler[] => {
  const jsonMockList = readMockListFile("mockList.json")

  if (jsonMockList) {
    return jsonMockList.map(generateHandler)
  }

  return []
}
