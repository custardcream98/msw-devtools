import { DefaultResponseSettingsProvider } from "~/components/contexts/default-response"
import { DefaultResponseDelaySettingsProvider } from "~/components/contexts/default-response-delay"
import { DefaultUrlSettingsProvider } from "~/components/contexts/default-url"
import { EditStateProvider } from "~/components/contexts/edit-state"
import { MockListProvider } from "~/components/contexts/mock-list"
import { useTab } from "~/components/tabs/TabBar/context"
import { Tab } from "~/constants"

import { AddMockTab } from "./AddMockTab"
import { LogTab } from "./LogTab"
import { MockListTab } from "./MockListTab"
import { SettingsTab } from "./SettingsTab"

export const TabBody = () => {
  const { tab } = useTab()

  return (
    <div className='min-h-0 flex-1'>
      <DefaultUrlSettingsProvider>
        <DefaultResponseSettingsProvider>
          <DefaultResponseDelaySettingsProvider>
            <MockListProvider>
              <EditStateProvider>
                {tab === Tab.AddMock && <AddMockTab />}
                {tab === Tab.MockList && <MockListTab />}
                {tab === Tab.Log && <LogTab />}
                {tab === Tab.Settings && <SettingsTab />}
              </EditStateProvider>
            </MockListProvider>
          </DefaultResponseDelaySettingsProvider>
        </DefaultResponseSettingsProvider>
      </DefaultUrlSettingsProvider>
    </div>
  )
}
