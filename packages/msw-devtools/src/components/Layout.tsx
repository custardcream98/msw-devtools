import { clsx } from "clsx"
import { useRef } from "react"

import { StorageKey } from "~/constants"
import { useLocalStorageState } from "~/hooks/useLocalStorageState"
import { useLongClick } from "~/hooks/useLongClick"

type LayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  isOpened: boolean
}

export const Layout = ({ isOpened, children, ...props }: LayoutProps) => {
  const [height, setHeight] = useLocalStorageState(StorageKey.HEIGHT, null)
  const ref = useRef<HTMLButtonElement>(null)
  const { isLongClicking } = useLongClick({
    targetRef: ref,
    threshold: 0,
    onDrag: (event) => {
      setHeight(event.clientY)
    }
  })

  return (
    <div
      className={clsx(
        "fixed bottom-0 left-0 right-0 flex flex-col",
        "overflow-hidden rounded-tl-md rounded-tr-md border border-slate-200 bg-background-light !font-sans text-gray-700",
        "transition-transform duration-300",
        !isOpened && "translate-y-[calc(100%+5px)]", // intended to translate little bit more
        "h-[min(max(calc(100dvh-var(--height)),100px),calc(100dvh-100px))] max-h-screen min-h-12"
      )}
      style={{
        "--height": height ? `${height}px` : "50%"
      }}
      {...props}
    >
      <button
        type='button'
        className={clsx(
          "absolute left-0 right-0 top-0 z-10 flex h-[6px] cursor-row-resize items-center justify-center transition-colors hover:bg-slate-200",
          "touch-none",
          isLongClicking && "bg-slate-300"
        )}
        onTouchStart={(e) => e.preventDefault()}
        ref={ref}
      >
        <span className='pointer-events-none h-[2px] w-8 rounded-full bg-slate-300' />
      </button>
      {children}
    </div>
  )
}
