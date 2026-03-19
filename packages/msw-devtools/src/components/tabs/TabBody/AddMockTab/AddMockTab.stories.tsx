import type { Meta, StoryObj } from "@storybook/react"
import React from "react"

import { DefaultResponseSettingsProvider } from "~/components/contexts/default-response"
import { DefaultResponseDelaySettingsProvider } from "~/components/contexts/default-response-delay"
import { DefaultUrlSettingsProvider } from "~/components/contexts/default-url"
import { FloatingButtonSettingsProvider } from "~/components/contexts/floating-button"
import { MockListProvider } from "~/components/contexts/mock-list"
import { TabProvider } from "~/components/tabs/TabBar"

import { AddMockTab } from "./AddMockTab"

/**
 * AddMockTab에 필요한 모든 context를 제공하는 wrapper
 * MSW/Server 모듈은 Storybook vite config에서 mock으로 대체됨
 */
const AllProviders = ({ children }: React.PropsWithChildren) => (
  <TabProvider>
    <FloatingButtonSettingsProvider>
      <DefaultUrlSettingsProvider>
        <DefaultResponseSettingsProvider>
          <DefaultResponseDelaySettingsProvider>
            <MockListProvider>{children}</MockListProvider>
          </DefaultResponseDelaySettingsProvider>
        </DefaultResponseSettingsProvider>
      </DefaultUrlSettingsProvider>
    </FloatingButtonSettingsProvider>
  </TabProvider>
)

const meta = {
  title: "Tabs/AddMockTab",
  component: AddMockTab,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <AllProviders>
        <div style={{ height: 500 }}>
          <Story />
        </div>
      </AllProviders>
    )
  ],
  parameters: {
    layout: "fullscreen"
  }
} satisfies Meta<typeof AddMockTab>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 AddMock 탭 - README image1.png 캡처 소스 */
export const Default: Story = {}
