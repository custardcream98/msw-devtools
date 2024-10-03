import "vite/types/importMeta.d.ts"
import "vite/types/customEvent.d.ts"

declare module "vite/types/customEvent.d.ts" {
  interface CustomEventMap {
    "msw-devtools:from-client": { msg: string }
    "msw-devtools:ack": { msg: string }
    "msw-devtools:from-server": { msg: string }
  }
}
