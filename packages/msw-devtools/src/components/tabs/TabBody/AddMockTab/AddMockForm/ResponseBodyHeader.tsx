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
    <span className='flex items-center justify-between'>
      Response Body (JSON){" "}
      {props.responseType === JsonMockResponseType.sequential && (
        <span className='ml-2 mr-auto rounded-lg border-2 border-solid border-orange-500 px-2 py-1 !font-mono text-[0.65rem] font-semibold text-orange-500'>
          {t("tabs.addMock.sequentialBadge", {
            count: props.responseCount
          })}
        </span>
      )}
      <button
        className='button hover:bg-slate-300 hover:text-slate-600'
        type='button'
        title={t("tabs.addMock.addResponseButton.title")}
        onClick={onAddResponse}
      >
        <FaPlus size={16} />
      </button>
    </span>
  )
}
