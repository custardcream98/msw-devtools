import { clsx } from "clsx"
import { useTranslation } from "react-i18next"

import { Tab } from "~/constants"

import { useTab } from "./context"

const TabButton = ({ tab }: { tab: Tab }) => {
  const { tab: currentTab, setTab } = useTab()
  const { t } = useTranslation()

  const isActive = currentTab === tab

  return (
    <button
      type='button'
      className={clsx(
        "relative px-3 py-2 text-sm transition-colors",
        "hover:text-slate-700",
        isActive ? "font-semibold text-slate-800" : "font-normal text-slate-400"
      )}
      onClick={() => setTab(tab)}
    >
      {t(tab)}
      {isActive && (
        <span className='absolute bottom-0 left-1 right-1 h-[2px] rounded-full bg-slate-700' />
      )}
    </button>
  )
}

export const TabBar = ({ children }: React.PropsWithChildren) => {
  return (
    <div className='flex h-10 items-center gap-0.5 border-b border-slate-200 px-2'>
      <TabButton tab={Tab.AddMock} />
      <TabButton tab={Tab.MockList} />
      <TabButton tab={Tab.Settings} />
      <div className='mx-auto'></div>
      {children}
    </div>
  )
}
