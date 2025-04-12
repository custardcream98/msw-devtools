import { clsx } from "clsx"
import { useTranslation } from "react-i18next"

export const PromptModePill = ({
  className,
  isPromptModeActivated
}: {
  className?: string
  isPromptModeActivated: boolean
}) => {
  const { t } = useTranslation()

  if (!isPromptModeActivated) {
    return null
  }

  return (
    <span
      className={clsx(
        className,
        "mr-2 shrink-0 rounded-lg bg-slate-100 px-[0.3rem] py-[0.125rem] !font-mono text-[0.7rem] font-semibold uppercase text-orange-600"
      )}
    >
      {t("promptModePill.promptMode")}
    </span>
  )
}
