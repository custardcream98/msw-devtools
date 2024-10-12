import { installMSWDevtools } from "@custardcream/msw-devtools"
import { setupWorker } from "msw/browser"

export const start = () => {
  const worker = setupWorker()

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
