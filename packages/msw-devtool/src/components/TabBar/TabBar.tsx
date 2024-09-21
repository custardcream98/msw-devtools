import { clsx } from "clsx"

import { Tab, useTab } from "./context"

const TabButton = ({ tab }: { tab: Tab }) => {
  const { tab: currentTab, setTab } = useTab()

  const isActive = currentTab === tab

  return (
    <button
      type='button'
      className={clsx(
        "msw-d-button hover:msw-d-bg-slate-300 hover:msw-d-text-slate-600",
        isActive
          ? "msw-d-font-semibold msw-d-text-slate-700"
          : "msw-d-font-normal msw-d-text-slate-400"
      )}
      onClick={() => setTab(tab)}
    >
      {tab}
    </button>
  )
}

export const TabBar = ({ children }: React.PropsWithChildren) => {
  return (
    <div className='msw-d-flex msw-d-h-10 msw-d-items-center msw-d-gap-2 msw-d-border-b msw-d-border-solid msw-d-border-slate-200 msw-d-px-3 msw-d-py-1'>
      <TabButton tab={Tab.AddMock} />
      <TabButton tab={Tab.ActivatedMockList} />
      <TabButton tab={Tab.Settings} />
      <div className='msw-d-mx-auto'></div>
      {children}
    </div>
  )
}