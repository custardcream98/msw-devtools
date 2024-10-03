export const viteHmr = () => {
  if (import.meta.hot) {
    import.meta.hot.send("msw-devtools:ack")

    import.meta.hot.on("msw-devtools:from-server", (data) => {
      console.log("Received message from server", data)
    })
  }
}
