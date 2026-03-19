import { clsx } from "clsx"
import type { StatusOption } from "core"

import { STATUS_COLOR, STATUS_NAME } from "~/constants"

const STATUS_BG: Record<string, string> = {
  "200": "bg-green-50",
  "201": "bg-green-50",
  "400": "bg-red-50",
  "401": "bg-red-50",
  "403": "bg-red-50",
  "404": "bg-red-50",
  "500": "bg-red-50"
}

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
        "shrink-0 rounded px-1.5 py-0.5 !font-mono text-[0.65rem] font-semibold uppercase",
        STATUS_COLOR[status],
        STATUS_BG[status]
      )}
    >
      {status} {STATUS_NAME[status]}
    </span>
  )
}
