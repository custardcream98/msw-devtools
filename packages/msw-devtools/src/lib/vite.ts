import { JsonMock } from "core"

let _isVitePluginEnabled = false

export const isVitePluginEnabled = () => _isVitePluginEnabled

export const viteSendMockList = (mockList: JsonMock[]) => {
  if (import.meta.hot) {
    const hot = import.meta.hot

    hot.send("msw-devtools:mock-list:update", { mockList })
  }
}

export const viteHmr = (initialMockList?: JsonMock[]) => {
  if (import.meta.hot) {
    const hot = import.meta.hot

    hot.send("msw-devtools:syn")

    hot.on("msw-devtools:ack", () => {
      _isVitePluginEnabled = true
      hot.send("msw-devtools:ack")

      if (initialMockList) {
        viteSendMockList(initialMockList)
      }
    })
  }
}
