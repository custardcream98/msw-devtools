import { clsx } from "clsx"
import { useTranslation } from "react-i18next"

import { Tab, useTab } from "./context"

const TabButton = ({ tab }: { tab: Tab }) => {
  const { tab: currentTab, setTab } = useTab()
  const { t } = useTranslation()

  const isActive = currentTab === tab

  return (
    <button
      type='button'
      className={clsx(
        "button hover:bg-slate-300 hover:text-slate-600",
        isActive ? "font-semibold text-slate-700" : "font-normal text-slate-400"
      )}
      onClick={() => setTab(tab)}
    >
      {t(tab)}
    </button>
  )
}

export const TabBar = ({ children }: React.PropsWithChildren) => {
  return (
    <div className='flex h-10 items-center gap-2 border-b border-solid border-slate-200 px-3 py-1'>
      <TabButton tab={Tab.AddMock} />
      <TabButton tab={Tab.MockList} />
      <TabButton tab={Tab.Settings} />
      <div className='mx-auto'></div>
      {children}
    </div>
  )
}
