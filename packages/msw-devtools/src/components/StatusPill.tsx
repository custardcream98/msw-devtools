import { clsx } from "clsx"
import { StatusOption } from "core"

import { STATUS_NAME } from "~/constants"

export const STATUS_COLOR: Record<StatusOption, string> = {
  [StatusOption["200"]]: "text-green-700",
  [StatusOption["201"]]: "text-green-700",
  [StatusOption["400"]]: "text-red-700",
  [StatusOption["401"]]: "text-red-700",
  [StatusOption["403"]]: "text-red-700",
  [StatusOption["404"]]: "text-red-700",
  [StatusOption["500"]]: "text-red-700"
} as const

const STATUS_BG: Record<StatusOption, string> = {
  [StatusOption["200"]]: "bg-green-50",
  [StatusOption["201"]]: "bg-green-50",
  [StatusOption["400"]]: "bg-red-50",
  [StatusOption["401"]]: "bg-red-50",
  [StatusOption["403"]]: "bg-red-50",
  [StatusOption["404"]]: "bg-red-50",
  [StatusOption["500"]]: "bg-red-50"
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
