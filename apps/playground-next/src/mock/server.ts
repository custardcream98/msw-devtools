import { jsonMocksToHandlers } from "@custardcream/msw-devtools-server"
import { setupServer } from "msw/node"

import mocks from "../../mockList.json"

const server = setupServer(...jsonMocksToHandlers(mocks))

server.listen()
