import { JsonMockResponseType } from "core"
import { useTranslation } from "react-i18next"
import { FaPlus } from "react-icons/fa6"

type ResponseBodyHeaderProps = {
  onAddResponse: () => void
} & (
  | {
      responseType: typeof JsonMockResponseType.single
    }
  | {
      responseType: typeof JsonMockResponseType.sequential
      responseCount: number
    }
)

export const ResponseBodyHeader = ({
  onAddResponse,
  ...props
}: ResponseBodyHeaderProps) => {
  const { t } = useTranslation()

  return (
    <span className='flex items-center justify-between text-sm'>
      Response Body (JSON){" "}
      {props.responseType === JsonMockResponseType.sequential && (
        <span className='ml-2 mr-auto rounded border border-orange-400 bg-orange-50 px-1.5 py-0.5 !font-mono text-[0.65rem] font-semibold text-orange-600'>
          {t("tabs.addMock.sequentialBadge", {
            count: props.responseCount
          })}
        </span>
      )}
      <button
        className='rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'
        type='button'
        title={t("tabs.addMock.addResponseButton.title")}
        onClick={onAddResponse}
      >
        <FaPlus size={14} />
      </button>
    </span>
  )
}
