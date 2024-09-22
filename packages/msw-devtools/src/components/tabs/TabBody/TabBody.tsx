import { ActivatedMockListProvider } from "~/components/contexts/activated-mock-list"
import { DefaultResponseSettingsProvider } from "~/components/contexts/default-response"
import { DefaultUrlSettingsProvider } from "~/components/contexts/default-url"
import { Tab, useTab } from "~/components/tabs/TabBar/context"

import { ActivatedMockListTab } from "./ActivatedMockListTab"
import { AddMockTab } from "./AddMockTab"
import { SettingsTab } from "./SettingsTab"

export const TabBody = () => {
  const { tab } = useTab()

  return (
    <div className='min-h-0 flex-1'>
      <DefaultUrlSettingsProvider>
        <DefaultResponseSettingsProvider>
          <ActivatedMockListProvider>
            {tab === Tab.AddMock && <AddMockTab />}
            {tab === Tab.ActivatedMockList && <ActivatedMockListTab />}
            {tab === Tab.Settings && <SettingsTab />}
          </ActivatedMockListProvider>
        </DefaultResponseSettingsProvider>
      </DefaultUrlSettingsProvider>
    </div>
  )
}
