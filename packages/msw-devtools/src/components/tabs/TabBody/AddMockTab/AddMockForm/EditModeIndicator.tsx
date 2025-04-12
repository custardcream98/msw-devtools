import { clsx } from "clsx"
import { useTranslation } from "react-i18next"

interface EditModeIndicatorProps {
  isEdit: boolean
}

export const EditModeIndicator = ({ isEdit }: EditModeIndicatorProps) => {
  const { t } = useTranslation()

  return (
    <div
      className={clsx(
        "-mx-3 -mt-3 mb-3",
        "grid overflow-hidden transition-[grid-template-rows] duration-300",
        isEdit ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}
    >
      <div className='overflow-hidden'>
        <p className='bg-green-600 py-1 text-center text-xs font-bold uppercase text-white'>
          {t("tabs.addMock.editModeIndicator")}
        </p>
      </div>
    </div>
  )
}
