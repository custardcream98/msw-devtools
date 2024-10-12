import { getInitialHandlers, register } from "@custardcream/msw-devtools-server"
import { setupServer } from "msw/node"

const server = setupServer(...getInitialHandlers())

server.listen()

register({ server })
