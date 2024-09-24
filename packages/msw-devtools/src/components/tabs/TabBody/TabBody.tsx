import { DefaultResponseSettingsProvider } from "~/components/contexts/default-response"
import { DefaultUrlSettingsProvider } from "~/components/contexts/default-url"
import { MockListProvider } from "~/components/contexts/mock-list"
import { Tab, useTab } from "~/components/tabs/TabBar/context"

import { AddMockTab } from "./AddMockTab"
import { MockListTab } from "./MockListTab"
import { SettingsTab } from "./SettingsTab"

export const TabBody = () => {
  const { tab } = useTab()

  return (
    <div className='min-h-0 flex-1'>
      <DefaultUrlSettingsProvider>
        <DefaultResponseSettingsProvider>
          <MockListProvider>
            {tab === Tab.AddMock && <AddMockTab />}
            {tab === Tab.MockList && <MockListTab />}
            {tab === Tab.Settings && <SettingsTab />}
          </MockListProvider>
        </DefaultResponseSettingsProvider>
      </DefaultUrlSettingsProvider>
    </div>
  )
}
