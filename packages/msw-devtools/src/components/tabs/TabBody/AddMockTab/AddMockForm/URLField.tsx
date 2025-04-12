import { Control, Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { FIELD_NAME, FormFieldValues } from "~/constants"

interface URLFieldProps {
  control: Control<FormFieldValues>
  isReadOnly?: boolean
}

export const URLField = ({ control, isReadOnly = false }: URLFieldProps) => {
  const { t } = useTranslation()

  return (
    <Controller
      name={FIELD_NAME.URL}
      control={control}
      rules={{
        required: true
      }}
      render={({ field }) => (
        <input
          className='w-full bg-slate-50 p-2 !font-mono msw-round-border [&[readonly]]:opacity-40'
          type='text'
          placeholder={t("tabs.addMock.url.placeholder")}
          readOnly={isReadOnly}
          {...field}
        />
      )}
    />
  )
}
