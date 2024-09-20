import { Tab, useTab } from "~/components/TabBar/context"
import { ActivatedMockListTab } from "~/components/TabBody/ActivatedMockListTab/ActivatedMockListTab"
import { ActivatedMockListProvider } from "~/components/TabBody/ActivatedMockListTab/context"
import { AddMockTab } from "~/components/TabBody/AddMockTab"
import { SettingsTab } from "~/components/TabBody/SettingsTab"
import { SettingsProvider } from "~/components/TabBody/SettingsTab/context"

export const TabBody = () => {
  const { tab } = useTab()

  return (
    <div className='msw-d-min-h-0 msw-d-flex-1'>
      <ActivatedMockListProvider>
        <SettingsProvider>
          {tab === Tab.AddMock && <AddMockTab />}
          {tab === Tab.ActivatedMockList && <ActivatedMockListTab />}
          {tab === Tab.Settings && <SettingsTab />}
        </SettingsProvider>
      </ActivatedMockListProvider>
    </div>
  )
}
