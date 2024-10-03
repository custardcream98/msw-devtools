import type {
  InferCustomEventPayload,
  Plugin,
  WebSocketCustomListener
} from "vite"

const ackHandler: WebSocketCustomListener<
  InferCustomEventPayload<"msw-devtools:ack">
> = (_, client) => {
  client.send("msw-devtools:from-server", {
    msg: "Hi! I got your message!"
  })
}

export default function plugin(): Plugin {
  return {
    name: "vite-plugin-msw-devtools",
    configureServer(server) {
      server.ws.on("msw-devtools:ack", ackHandler)
    }
  }
}
