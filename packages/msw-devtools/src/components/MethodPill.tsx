import { clsx } from "clsx"
import type { MethodOption } from "core"

import { METHOD_COLOR } from "~/constants"

const METHOD_BG: Record<string, string> = {
  get: "bg-blue-50",
  post: "bg-green-50",
  put: "bg-yellow-50",
  delete: "bg-red-50",
  patch: "bg-teal-50",
  options: "bg-purple-50",
  head: "bg-gray-50"
}

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
        "shrink-0 rounded px-1.5 py-0.5 !font-mono text-[0.65rem] font-semibold uppercase",
        METHOD_COLOR[method],
        METHOD_BG[method]
      )}
    >
      {method}
    </span>
  )
}
