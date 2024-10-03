import type { Plugin } from "vite"

import { mockList } from "~/listeners/mock-list"
import { setPluginOptions } from "~/options"
import type { PluginOptions } from "~/types"

export default function plugin(options: PluginOptions = {}): Plugin {
  setPluginOptions(options)

  return {
    name: "vite-plugin-msw-devtools",
    configureServer(server) {
      const { ws } = server

      ws.on("msw-devtools:syn", (_, client) => {
        client.send("msw-devtools:ack")

        ws.on("msw-devtools:ack", () => {
          ws.on("msw-devtools:mock-list:update", mockList(ws))
        })
      })
    }
  }
}
