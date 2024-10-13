import { generateHandler, type JsonMock } from "core"
import type { HttpHandler } from "msw"
import type { SetupServerApi } from "msw/node"

import { readMockListFile, watchMockListFile } from "~/file"

export const jsonMockListToHandlers = (mockList: JsonMock[]): HttpHandler[] =>
  mockList.filter(({ isActivated }) => isActivated).map(generateHandler)

export const register = ({ server }: { server: SetupServerApi }) => {
  watchMockListFile("mockList.json", (mockList) => {
    server.resetHandlers(...jsonMockListToHandlers(mockList))
  })
}

export const getInitialHandlers = (): HttpHandler[] => {
  const mockList = readMockListFile("mockList.json")

  if (mockList) {
    return jsonMockListToHandlers(mockList)
  }

  return []
}
