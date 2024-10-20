import type { InstallProps } from "~/types"

let isInitialized = false
export const installMSWDevtools = async (props: InstallProps) => {
  if (!isInitialized) {
    isInitialized = true

    const { createDevtool } = await import("~/lib/createDevtool")

    await createDevtool(props)
  }
}

export type { InstallProps }
