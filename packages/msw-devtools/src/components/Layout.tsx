import { clsx } from "clsx"

import { StorageKey } from "~/constants"
import { useIsDragging } from "~/hooks/useIsDragging"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"

type LayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  isOpened: boolean
}

export const Layout = ({ isOpened, children, ...props }: LayoutProps) => {
  const [height, setHeight] = useLocalStorageState(StorageKey.HEIGHT, null)

  const { isDragging, props: isDraggingProps } = useIsDragging({
    onDrag: (event) => {
      setHeight(event.clientY)
    }
  })

  return (
    <div
      className={clsx(
        "fixed bottom-0 left-0 right-0 flex flex-col",
        "overflow-hidden rounded-tl-2xl rounded-tr-2xl bg-background-light !font-sans text-gray-700 outline outline-1 outline-slate-200",
        "transition-transform duration-300",
        !isOpened && "translate-y-[calc(100%+5px)]", // intended to translate little bit more
        "h-[var(--height)] max-h-screen min-h-12"
      )}
      style={{
        "--height": height
          ? `min(max(calc(100vh - ${height}px), 100px), calc(100vh - 100px))`
          : "50%"
      }}
      {...props}
    >
      <button
        type='button'
        className={clsx(
          "absolute left-0 right-0 top-0 h-[3px] cursor-row-resize transition-colors hover:bg-slate-700",
          isDragging && "bg-slate-700"
        )}
        {...isDraggingProps}
      ></button>
      {children}
    </div>
  )
}
