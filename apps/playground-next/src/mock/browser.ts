import { installMSWDevtools } from "@custardcream/msw-devtools"
import { setupWorker } from "msw/browser"

import { handlers } from "./handlers"

export const start = () => {
  const worker = setupWorker(...handlers)

  return installMSWDevtools({
    setupWorker: worker,
    options: {
      onUnhandledRequest(request, print) {
        if (request.url.includes("_next")) {
          return
        }
        print.warning()
      }
    }
  })
}
