import "vite/types/customEvent.d.ts"

declare module "vite/types/customEvent.d.ts" {
  interface CustomEventMap {
    "msw-devtools:from-client": {}
    "msw-devtools:ack": { msg: string }
    "msw-devtools:from-server": { msg: string }
  }
}
