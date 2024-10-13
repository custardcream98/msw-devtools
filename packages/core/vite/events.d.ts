import "vite/types/importMeta.d.ts"
import "vite/types/customEvent.d.ts"
import type { JsonMock } from "../src"

declare module "vite/types/customEvent.d.ts" {
  interface CustomEventMap {
    "msw-devtools:syn": null
    "msw-devtools:ack": null
    "msw-devtools:mock-list:update": { mockList: JsonMock[] }
  }
}
