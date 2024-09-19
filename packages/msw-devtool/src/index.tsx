import type { InitializeProps } from "~/lib/msw"

export type InstallProps = InitializeProps & {
  initialOpen?: boolean
}

let isInitialized = false
export const installMSWDevtool = async (props: InstallProps) => {
  if (isInitialized || process.env.NODE_ENV === "production") {
    return
  }

  isInitialized = true

  const { createDevtool } = await import("~/lib/createDevtool")

  await createDevtool(props)
}
