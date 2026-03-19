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
        "shrink-0 rounded bg-orange-50 px-1.5 py-0.5 !font-mono text-[0.65rem] font-semibold uppercase text-orange-600"
      )}
    >
      {t("promptModePill.promptMode")}
    </span>
  )
}
