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
    <>
      <button
        type='submit'
        className={clsx(
          "button flex-shrink-0 text-xs text-white hover:text-white disabled:pointer-events-none disabled:bg-slate-400",
          isEdit
            ? "bg-green-600 hover:bg-green-600"
            : "bg-blue-600 hover:bg-blue-800"
        )}
        disabled={!isValid && !isFixable}
      >
        {submitButtonLabel}
      </button>
      {isEdit && (
        <button
          type='button'
          className='button flex-shrink-0 bg-red-600 text-xs text-white hover:bg-red-800 hover:text-white'
          onClick={onReset}
        >
          {t("tabs.addMock.cancelEdit")}
        </button>
      )}
    </>
  )
}
