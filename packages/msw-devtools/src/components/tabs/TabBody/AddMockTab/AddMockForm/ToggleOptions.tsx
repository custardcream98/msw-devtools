import { Control, Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Toggle } from "~/components/Toggle"
import { FIELD_NAME, FormFieldValues } from "~/constants"

interface ToggleOptionsProps {
  control: Control<FormFieldValues>
}

export const ToggleOptions = ({ control }: ToggleOptionsProps) => {
  const { t } = useTranslation()

  return (
    <div className='flex shrink-0 items-center justify-end gap-2'>
      <Controller
        name={FIELD_NAME.IS_ACTIVATED}
        control={control}
        render={({ field: { onChange, value, ...field } }) => (
          <label className='flex items-center'>
            {t("tabs.addMock.isActivated.label")}
            <Toggle
              className='ml-2'
              {...field}
              checked={value}
              onChange={onChange}
            />
          </label>
        )}
      />
      <Controller
        name={FIELD_NAME.SHOULD_PROMPT_RESPONSE}
        control={control}
        render={({ field: { onChange, value, ...field } }) => (
          <label className='flex items-center'>
            {t("tabs.addMock.shouldPromptResponse.label")}
            <Toggle
              className='ml-2'
              {...field}
              checked={value}
              onChange={onChange}
            />
          </label>
        )}
      />
    </div>
  )
}
