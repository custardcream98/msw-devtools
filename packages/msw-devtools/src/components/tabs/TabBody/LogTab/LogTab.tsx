import { useTranslation } from "react-i18next"

export const LogTab = () => {
  const { t } = useTranslation()

  return (
    <div className='flex h-full items-center justify-center text-sm text-slate-400'>
      {t("tabs.log.noLogs")}
    </div>
  )
}
