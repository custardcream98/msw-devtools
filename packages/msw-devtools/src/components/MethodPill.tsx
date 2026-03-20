import { clsx } from "clsx"
import { MethodOption } from "core"

export const METHOD_COLOR = {
  [MethodOption.get]: "text-blue-600",
  [MethodOption.post]: "text-green-600",
  [MethodOption.put]: "text-yellow-600",
  [MethodOption.delete]: "text-red-600",
  [MethodOption.patch]: "text-teal-500",
  [MethodOption.options]: "text-purple-600",
  [MethodOption.head]: "text-gray-600"
} as const

const METHOD_BG: Record<MethodOption, string> = {
  [MethodOption.get]: "bg-blue-50",
  [MethodOption.post]: "bg-green-50",
  [MethodOption.put]: "bg-yellow-50",
  [MethodOption.delete]: "bg-red-50",
  [MethodOption.patch]: "bg-teal-50",
  [MethodOption.options]: "bg-purple-50",
  [MethodOption.head]: "bg-gray-50"
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
