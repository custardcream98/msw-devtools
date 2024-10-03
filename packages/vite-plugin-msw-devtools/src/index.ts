import type { Plugin } from "vite"

import type { WebSocketListener } from "~/types"

const ack: WebSocketListener<"msw-devtools:ack"> = (_, client) => {
  client.send("msw-devtools:from-server", {
    msg: "Hi! I got your message!"
  })
}

export default function plugin(): Plugin {
  return {
    name: "vite-plugin-msw-devtools",
    configureServer(server) {
      server.ws.on("msw-devtools:ack", ack)
    }
  }
}
