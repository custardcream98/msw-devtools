import { clsx } from "clsx"
import { MethodOption, StatusOption } from "core"
import { Control, Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { METHOD_COLOR } from "~/components/MethodPill"
import { STATUS_COLOR } from "~/components/StatusPill"
import { FIELD_NAME, FormFieldValues, STATUS_NAME } from "~/constants"

interface RequestOptionsProps {
  control: Control<FormFieldValues>
}

export const RequestOptions = ({ control }: RequestOptionsProps) => {
  const { t } = useTranslation()

  return (
    <div className='mt-2 flex w-full shrink-0 items-center gap-2'>
      <div className='flex w-full items-center overflow-hidden !font-mono msw-round-border'>
        <Controller
          name={FIELD_NAME.METHOD}
          control={control}
          render={({ field }) => (
            <select
              className={clsx(
                "h-full w-full border-r border-slate-200 bg-slate-50 p-2 text-xs font-semibold uppercase focus:outline-none focus:ring-1 focus:ring-inset focus:ring-slate-300",
                METHOD_COLOR[field.value]
              )}
              {...field}
            >
              {Object.values(MethodOption).map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          )}
        />
        <Controller
          name={FIELD_NAME.STATUS}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <select
              className={clsx(
                "h-full w-full border-r border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-inset focus:ring-slate-300",
                STATUS_COLOR[field.value]
              )}
              {...field}
            >
              {Object.values(StatusOption).map((status) => (
                <option key={status} value={status}>
                  {status} {STATUS_NAME[status]}
                </option>
              ))}
            </select>
          )}
        />
        <Controller
          name={FIELD_NAME.RESPONSE_DELAY}
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <label className='flex h-full w-full min-w-0 items-center bg-slate-50 text-xs'>
              <span className='ml-2 min-w-fit text-slate-500'>
                {t("tabs.addMock.responseDelay.label")}
              </span>
              <input
                className='min-w-2 flex-1 bg-transparent p-2 text-right !font-mono focus:outline-none'
                type='number'
                step={0.1}
                min={0}
                value={value}
                onChange={(e) => {
                  onChange(Number(e.target.value))
                }}
                {...field}
              />
            </label>
          )}
        />
      </div>
    </div>
  )
}
