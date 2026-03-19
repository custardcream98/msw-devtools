import { clsx } from "clsx"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

interface FormButtonsProps {
  isEdit: boolean
  isValid: boolean
  isFixable: boolean
  onReset: () => void
}

export const FormButtons = ({
  isEdit,
  isValid,
  isFixable,
  onReset
}: FormButtonsProps) => {
  const { t } = useTranslation()

  const submitButtonLabel = useMemo(() => {
    if (isFixable) {
      return t("tabs.addMock.autoFix")
    }

    if (isEdit) {
      return t("tabs.addMock.editSubmit")
    }

    return t("tabs.addMock.submit")
  }, [isFixable, isEdit, t])

  return (
    <div className='flex shrink-0 items-center gap-1.5'>
      <button
        type='submit'
        className={clsx(
          "button shrink-0 text-xs text-white hover:text-white disabled:pointer-events-none disabled:bg-slate-300 disabled:text-slate-400",
          isEdit
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        )}
        disabled={!isValid && !isFixable}
      >
        {submitButtonLabel}
      </button>
      {isEdit && (
        <button
          type='button'
          className='button shrink-0 bg-slate-500 text-xs text-white hover:bg-slate-600 hover:text-white'
          onClick={onReset}
        >
          {t("tabs.addMock.cancelEdit")}
        </button>
      )}
    </div>
  )
}
