import type { InitializeProps } from "~/lib/initializeMsw"

let isInitialized = false
export const installMSWDevtool = async (props: InitializeProps) => {
  if (isInitialized || process.env.NODE_ENV === "production") {
    return
  }

  isInitialized = true

  const { createDevtool } = await import("~/lib/createDevtool")

  await createDevtool(props)
}
