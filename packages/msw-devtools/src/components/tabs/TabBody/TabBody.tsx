import { Tab, useTab } from "~/components/tabs/TabBar/context"

import {
  ActivatedMockListProvider,
  ActivatedMockListTab
} from "./ActivatedMockListTab"
import { AddMockTab } from "./AddMockTab"
import { SettingsProvider, SettingsTab } from "./SettingsTab"

export const TabBody = () => {
  const { tab } = useTab()

  return (
    <div className='min-h-0 flex-1'>
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
