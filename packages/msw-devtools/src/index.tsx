import type { CreateDevtoolProps } from "~/lib/createDevtool"

export type InstallProps = CreateDevtoolProps

let isInitialized = false
export const installMSWDevtools = async (props: InstallProps) => {
  if (!isInitialized) {
    isInitialized = true

    const { createDevtool } = await import("~/lib/createDevtool")

    await createDevtool(props)
  }
}

export default installMSWDevtools
