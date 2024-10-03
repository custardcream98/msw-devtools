export default function plugin(): import("vite").Plugin {
  return {
    name: "vite-plugin-msw-devtools",
    configureServer(server) {
      server.ws.on("msw-devtools:ack", (_, client) => {
        client.send("msw-devtools:from-server", {
          msg: "Hi! I got your message!"
        })
      })
    }
  }
}
