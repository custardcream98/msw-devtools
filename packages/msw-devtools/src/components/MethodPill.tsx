import { clsx } from "clsx"
import type { MethodOption } from "core"

import { METHOD_COLOR } from "~/constants"

export const MethodPill = ({
  className,
  method
}: {
  className?: string
  method: MethodOption
}) => {
  return (
    <span
      className={clsx(
        className,
        "!font-mono font-semibold uppercase",
        METHOD_COLOR[method]
      )}
    >
      {method}
    </span>
  )
}
