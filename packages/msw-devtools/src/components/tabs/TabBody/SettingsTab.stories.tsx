import type { Meta, StoryObj } from "@storybook/react"
import React from "react"

import { DefaultResponseSettingsProvider } from "~/components/contexts/default-response"
import { DefaultResponseDelaySettingsProvider } from "~/components/contexts/default-response-delay"
import { DefaultUrlSettingsProvider } from "~/components/contexts/default-url"
import { FloatingButtonSettingsProvider } from "~/components/contexts/floating-button"

import { SettingsTab } from "./SettingsTab"

const AllProviders = ({ children }: React.PropsWithChildren) => (
  <FloatingButtonSettingsProvider>
    <DefaultUrlSettingsProvider>
      <DefaultResponseSettingsProvider>
        <DefaultResponseDelaySettingsProvider>
          {children}
        </DefaultResponseDelaySettingsProvider>
      </DefaultResponseSettingsProvider>
    </DefaultUrlSettingsProvider>
  </FloatingButtonSettingsProvider>
)

const meta = {
  title: "Tabs/SettingsTab",
  component: SettingsTab,
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
} satisfies Meta<typeof SettingsTab>

export default meta
type Story = StoryObj<typeof meta>

/** 설정 탭 - README image3.png 캡처 소스 */
export const Default: Story = {}
