import type { InitializeProps } from "~/lib/msw"

export interface InstallProps extends InitializeProps {
  /**
   * Whether the devtool should be open by default.
   *
   * @default true
   */
  initialOpen?: boolean
  /**
   * Whether should be connected to the @custardcream/msw-devtools-server
   *
   * @default false
   */
  isUsingServer?: boolean
}
