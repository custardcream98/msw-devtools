import { clsx } from "clsx"
import { useTranslation } from "react-i18next"
import { FaRegTrashCan } from "react-icons/fa6"

import { Toggle } from "~/components/Toggle"

export type LogFilter = "all" | "matched" | "unmatched"

export const LogControls = ({
  isRecording,
  onToggleRecording,
  onClear,
  filter,
  onFilterChange
}: {
  isRecording: boolean
  onToggleRecording: () => void
  onClear: () => void
  filter: LogFilter
  onFilterChange: (filter: LogFilter) => void
}) => {
  const { t } = useTranslation()

  return (
    <div className='flex items-center gap-3 border-b border-slate-200 px-3 py-2'>
      {/* Recording toggle */}
      <label className='flex items-center gap-1.5'>
        <span
          className={clsx(
            "text-[0.65rem] font-semibold",
            isRecording ? "text-red-500" : "text-slate-400"
          )}
        >
          {isRecording
            ? `● ${t("tabs.log.recording")}`
            : `⏸ ${t("tabs.log.paused")}`}
        </span>
        <Toggle checked={isRecording} onChange={onToggleRecording} />
      </label>

      {/* Filter buttons */}
      <div className='flex items-center gap-1'>
        {(["all", "matched", "unmatched"] as const).map((f) => (
          <button
            key={f}
            type='button'
            className={clsx(
              "rounded px-2 py-0.5 text-[0.65rem] transition-colors",
              filter === f
                ? "bg-slate-700 font-semibold text-white"
                : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            )}
            onClick={() => onFilterChange(f)}
          >
            {t(`tabs.log.filter.${f}`)}
          </button>
        ))}
      </div>

      {/* Clear button */}
      <button
        type='button'
        title={t("tabs.log.clearButton.title")}
        className='ml-auto rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'
        onClick={onClear}
      >
        <FaRegTrashCan size={12} />
      </button>
    </div>
  )
}
