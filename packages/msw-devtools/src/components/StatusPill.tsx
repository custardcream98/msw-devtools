import { clsx } from "clsx"
import type { StatusOption } from "core"

import { STATUS_COLOR, STATUS_NAME } from "~/constants"

export const StatusPill = ({
  className,
  status
}: {
  className?: string
  status: StatusOption
}) => {
  return (
    <span
      className={clsx(
        className,
        "shrink-0 rounded-lg bg-slate-100 px-[0.3rem] py-[0.125rem] !font-mono text-[0.7rem] font-semibold uppercase",
        STATUS_COLOR[status]
      )}
    >
      {status} {STATUS_NAME[status]}
    </span>
  )
}
